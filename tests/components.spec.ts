import { test, expect, type Page } from '@playwright/test'

async function mount(page: Page, markup: string) {
  await page.goto('/')
  await page.waitForFunction(() => (window as any).kayfReady)
  await page.locator('#fixture').evaluate((element, html) => element.innerHTML = html, markup)
}

test('auth retains credentials and checkboxes through a loading/error round trip', async ({ page }) => {
  await mount(page, '<kayf-auth-form></kayf-auth-form>')
  const auth = page.locator('kayf-auth-form')
  await auth.getByLabel('Email address').fill('alex@example.com')
  await auth.getByLabel('Password', { exact: true }).fill('secret')
  await auth.getByLabel('Remember me').check()
  await auth.evaluate(el => {
    el.addEventListener('kayf-submit', event => {
      (window as any).submitted = (event as CustomEvent).detail
      el.setAttribute('loading', '')
    })
  })
  await auth.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(auth.locator('form')).toHaveAttribute('aria-busy', 'true')
  await expect(auth.getByLabel('Email address')).toHaveValue('alex@example.com')
  await auth.evaluate(el => { el.setAttribute('error', 'Try again'); el.removeAttribute('loading') })
  await expect(auth.getByLabel('Password', { exact: true })).toHaveValue('secret')
  await expect(auth.getByLabel('Remember me')).toBeChecked()
  expect(await page.evaluate(() => (window as any).submitted.password)).toBe('secret')
  expect(await auth.getAttribute('password')).toBeNull()
})

test('registration errors are associated, revalidated and cleared; mode change keeps only email', async ({ page }) => {
  await mount(page, '<kayf-auth-form mode="signup"></kayf-auth-form>')
  const auth = page.locator('kayf-auth-form')
  await auth.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(auth.getByLabel('Full name')).toBeFocused()
  await expect(auth.getByLabel('Full name')).toHaveAttribute('aria-invalid', 'true')
  await auth.getByLabel('Full name').fill('Alex Morgan')
  await auth.getByLabel('Email address').fill('alex@example.com')
  await auth.getByLabel('Password', { exact: true }).fill('abcdefgh')
  await auth.getByLabel('Confirm password', { exact: true }).fill('abcdefgX')
  await auth.getByRole('checkbox').check()
  await auth.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(auth.getByLabel('Confirm password', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  await auth.getByLabel('Password', { exact: true }).fill('abcdefgX')
  await auth.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(auth.locator('[aria-invalid="true"]')).toHaveCount(0)
  await auth.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(auth.getByLabel('Email address')).toHaveValue('alex@example.com')
  await expect(auth.getByLabel('Password', { exact: true })).toHaveValue('')
})

test('phone keeps caret position during middle edits and deletes formatting spaces', async ({ page }) => {
  await mount(page, '<kayf-phone-input country="US" value="+12025550123"></kayf-phone-input>')
  const input = page.getByRole('textbox')
  await input.focus()
  await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(8, 8))
  await input.press('Backspace')
  await expect(input).toHaveValue('+1 202 550 123')
  expect(await input.evaluate((el: HTMLInputElement) => el.selectionStart)).toBeLessThan(8)
  await input.evaluate((el: HTMLInputElement) => el.setSelectionRange(6, 6))
  await input.press('Backspace')
  expect(await page.locator('kayf-phone-input').evaluate((el: any) => el.value)).toBe('+120550123')
  await input.press('7')
  const position = await input.evaluate((el: HTMLInputElement) => el.selectionStart)
  await page.locator('kayf-phone-input').evaluate(el => el.setAttribute('hint', 'Updated hint'))
  await expect(input).toBeFocused()
  expect(await input.evaluate((el: HTMLInputElement) => el.selectionStart)).toBe(position)
})

test('phone detects pasted international numbers and trims country changes', async ({ page }) => {
  await mount(page, '<kayf-phone-input></kayf-phone-input>')
  await page.getByRole('textbox').fill('+380671234567')
  expect(await page.locator('kayf-phone-input').evaluate((el: any) => [el.country, el.value])).toEqual(['UA', '+380671234567'])
  await page.getByRole('combobox').selectOption('US')
  expect(await page.locator('kayf-phone-input').evaluate((el: any) => el.value)).toBe('+1671234567')
})

test('compact language picker has a name, opens upward, selects, and closes on Tab', async ({ page }) => {
  await mount(page, '<kayf-language-switcher compact></kayf-language-switcher><button>Next control</button>')
  const picker = page.locator('kayf-language-switcher')
  const trigger = picker.getByRole('button', { name: 'Language: English' })
  await trigger.focus()
  await trigger.press('ArrowUp')
  await expect(picker.getByRole('option', { name: /Español/ })).toBeFocused()
  await page.keyboard.press('Home')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await expect(picker.getByRole('button', { name: 'Language: Deutsch' })).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(picker.getByRole('option', { name: /Deutsch/ })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused()
  await expect(picker).not.toHaveAttribute('open', '')
})

test('language data is defensive, unique and reconciles invalid selection', async ({ page }) => {
  await mount(page, '<kayf-language-switcher value="missing"></kayf-language-switcher>')
  expect(await page.locator('kayf-language-switcher').evaluate((el: any) => {
    el.languages = [{ code: 'ja', label: 'Japanese' }, { code: 'ja', label: 'Duplicate' }]
    const copy = el.languages; copy[0].label = 'Mutated'
    return [el.value, el.languages.length, el.languages[0].label]
  })).toEqual(['ja', 1, 'Japanese'])
})

test('verification code normalizes paste, participates in forms, resets and restores state', async ({ page }) => {
  await mount(page, '<form><kayf-verification-code name="otp" required></kayf-verification-code></form>')
  const code = page.locator('kayf-verification-code')
  expect(await code.evaluate((el: any) => el.checkValidity())).toBe(false)
  await code.evaluate(el => {
    (window as any).completions = 0
    el.addEventListener('kayf-complete', () => (window as any).completions++)
  })
  await code.getByRole('textbox').fill('12 34-56')
  await expect(code.getByRole('textbox')).toHaveValue('123456')
  expect(await page.locator('form').evaluate((form: HTMLFormElement) => new FormData(form).get('otp'))).toBe('123456')
  expect(await code.evaluate((el: any) => el.checkValidity())).toBe(true)
  expect(await page.evaluate(() => (window as any).completions)).toBe(1)
  await code.getByRole('textbox').press('Backspace')
  expect(await code.evaluate((el: any) => el.complete)).toBe(false)
  await page.locator('form').evaluate((form: HTMLFormElement) => form.reset())
  await expect(code.getByRole('textbox')).toHaveValue('')
  await code.evaluate((el: any) => el.formStateRestoreCallback('456789'))
  await expect(code.getByRole('textbox')).toHaveValue('456789')
  await code.evaluate(el => { const parent = el.parentElement!; el.remove(); parent.append(el) })
  await expect(code.getByRole('textbox')).toHaveValue('456789')
})

test('verification respects fieldsets, server errors and length changes', async ({ page }) => {
  await mount(page, '<form><fieldset disabled><kayf-verification-code name="otp" value="123456"></kayf-verification-code></fieldset></form>')
  const code = page.locator('kayf-verification-code')
  await expect(code.getByRole('textbox')).toBeDisabled()
  expect(await page.locator('form').evaluate((form: HTMLFormElement) => new FormData(form).has('otp'))).toBe(false)
  await page.locator('fieldset').evaluate(el => el.removeAttribute('disabled'))
  await expect(code.getByRole('textbox')).toBeEnabled()
  await code.evaluate(el => el.setAttribute('error', 'Expired code'))
  expect(await code.evaluate((el: any) => el.checkValidity())).toBe(false)
  await code.evaluate(el => { el.removeAttribute('error'); el.setAttribute('length', '4') })
  await expect(code.getByRole('textbox')).toHaveValue('1234')
  expect(await code.evaluate((el: any) => el.checkValidity())).toBe(true)
})

const file = (name: string, size = 12, mimeType = 'text/plain') => ({ name, mimeType, buffer: Buffer.alloc(size, 'x') })

test('file selection validates type, size and count, then removes and clears', async ({ page }) => {
  await mount(page, '<kayf-file-dropzone multiple accept=".txt" max-size="100" max-files="2"></kayf-file-dropzone>')
  const drop = page.locator('kayf-file-dropzone')
  await drop.locator('input').setInputFiles([file('one.txt'), file('two.txt'), file('three.txt'), file('large.txt', 101), file('image.png', 10, 'image/png')])
  await expect(drop.getByRole('list', { name: 'Selected files' }).locator('li')).toHaveCount(2)
  await expect(drop.getByRole('alert')).toContainText('Select up to 2 files')
  await expect(drop.getByRole('alert')).toContainText('exceeds the size limit')
  await expect(drop.getByRole('alert')).toContainText('type is not accepted')
  await drop.getByRole('button', { name: 'Remove one.txt' }).click()
  await expect(drop.getByRole('button', { name: 'Remove two.txt' })).toBeFocused()
  expect(await drop.evaluate((el: any) => { const copy = el.files; copy.length = 0; return el.files.length })).toBe(1)
  await drop.evaluate((el: any) => el.clear())
  await expect(drop.getByRole('list', { name: 'Selected files' }).locator('li')).toHaveCount(0)
})

test('file drop handles duplicates, disabled drops and preserves a rejected replacement', async ({ page }) => {
  await mount(page, '<kayf-file-dropzone accept=".txt"></kayf-file-dropzone>')
  const drop = page.locator('kayf-file-dropzone')
  await drop.locator('input').setInputFiles(file('keep.txt'))
  await drop.locator('input').setInputFiles(file('wrong.pdf'))
  expect(await drop.evaluate((el: any) => el.files[0].name)).toBe('keep.txt')
  await drop.evaluate(el => el.setAttribute('multiple', ''))
  await drop.evaluate((el: any) => {
    const transfer = new DataTransfer(); transfer.items.add(el.files[0])
    el.shadowRoot.querySelector('.dropzone').dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }))
  })
  await expect(drop.getByRole('alert')).toContainText('already selected')
  await drop.evaluate((el: any) => {
    el.setAttribute('disabled', '')
    const transfer = new DataTransfer(); transfer.items.add(new File(['new'], 'new.txt', { type: 'text/plain' }))
    el.shadowRoot.querySelector('.dropzone').dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }))
  })
  expect(await drop.evaluate((el: any) => el.files.length)).toBe(1)
})

test('stepper requests navigation without mutating consumer state', async ({ page }) => {
  await mount(page, '<kayf-stepper value="review" allow-navigation></kayf-stepper>')
  const stepper = page.locator('kayf-stepper')
  await stepper.evaluate((el: any) => {
    el.steps = [{ id: 'details', title: 'Details' }, { id: 'assets', title: 'Assets' }, { id: 'review', title: 'Review' }]
    el.addEventListener('kayf-step-change', (event: CustomEvent) => (window as any).navigation = event.detail)
  })
  await expect(stepper.locator('[aria-current="step"]')).toContainText('Review')
  await expect(stepper.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
  await stepper.getByRole('button', { name: /Details/ }).focus()
  await page.keyboard.press('Enter')
  expect(await stepper.evaluate((el: any) => el.value)).toBe('review')
  expect(await page.evaluate(() => (window as any).navigation)).toEqual({ value: 'details', previousValue: 'review', index: 0 })
  await stepper.evaluate((el: any) => { el.value = 'details'; el.setAttribute('complete', '') })
  await expect(stepper.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
  await expect(stepper.getByRole('status')).toHaveText('All steps complete')
  await stepper.evaluate(el => el.setAttribute('disabled', ''))
  await expect(stepper.getByRole('button')).toHaveCount(0)
})

test('stepper handles empty, duplicate and replacement data', async ({ page }) => {
  await mount(page, '<kayf-stepper value="missing"></kayf-stepper>')
  const stepper = page.locator('kayf-stepper')
  await expect(stepper).toContainText('No steps yet')
  expect(await stepper.evaluate((el: any) => {
    el.steps = [{ id: 'one', title: 'One' }, { id: 'one', title: 'Duplicate' }]
    const copy = el.steps; copy[0].title = 'Changed'
    return [el.value, el.steps.length, el.steps[0].title]
  })).toEqual(['one', 1, 'One'])
})

test('segmented control uses native arrows, skips disabled choices and submits form data', async ({ page }) => {
  await mount(page, '<form><kayf-segmented-control name="plan" value="monthly" required></kayf-segmented-control></form><button>After choices</button>')
  const control = page.locator('kayf-segmented-control')
  await control.evaluate((el: any) => el.options = [
    {value:'monthly',label:'Monthly'}, {value:'trial',label:'Trial',disabled:true}, {value:'yearly',label:'Yearly'},
  ])
  await control.getByRole('radio', { name:'Monthly' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(control.getByRole('radio', { name:'Yearly' })).toBeChecked()
  await expect(control.getByRole('radio', { name:'Yearly' })).toBeFocused()
  expect(await page.locator('form').evaluate((form: HTMLFormElement) => new FormData(form).get('plan'))).toBe('yearly')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name:'After choices' })).toBeFocused()
  await page.locator('form').evaluate((form: HTMLFormElement) => form.reset())
  await expect(control.getByRole('radio', { name:'Monthly' })).toBeChecked()
})

test('segmented control handles defaults, invalid options, fieldsets and required errors', async ({ page }) => {
  await mount(page, '<form><fieldset><kayf-segmented-control name="view" required></kayf-segmented-control></fieldset></form>')
  const control = page.locator('kayf-segmented-control')
  await control.evaluate((el: any) => el.options = [{value:'list',label:'List'}, {value:'board',label:'Board'}])
  expect(await control.evaluate((el: any) => el.checkValidity())).toBe(false)
  await control.evaluate((el: any) => el.value = 'board')
  expect(await control.evaluate((el: any) => el.checkValidity())).toBe(true)
  await control.evaluate((el: any) => {
    el.options = [{value:'list',label:'List'}, {value:'board',label:'Board',disabled:true}, {value:'list',label:'Duplicate'}]
    const copy = el.options; copy[0].label = 'Mutated'
  })
  expect(await control.evaluate((el: any) => [el.value,el.options.length,el.options[0].label,el.checkValidity()])).toEqual(['',2,'List',false])
  await control.getByRole('radio', {name:'List'}).check()
  await page.locator('fieldset').evaluate(el => el.setAttribute('disabled',''))
  await expect(control.getByRole('radio', {name:'List'})).toBeDisabled()
  expect(await page.locator('form').evaluate((form: HTMLFormElement) => new FormData(form).has('view'))).toBe(false)
  await page.locator('fieldset').evaluate(el => el.removeAttribute('disabled'))
  await control.evaluate(el => el.setAttribute('error','Unavailable'))
  expect(await control.evaluate((el: any) => el.checkValidity())).toBe(false)
})

test('toast actions persist, preserve focus, can be cancelled and return focus after dismiss', async ({ page }) => {
  await mount(page, '<button id="origin">Archive</button><kayf-toast-stack inline></kayf-toast-stack>')
  await page.getByRole('button', {name:'Archive',exact:true}).focus()
  const stack = page.locator('kayf-toast-stack')
  await stack.evaluate((el: any) => el.show({id:'undo',title:'Project archived',description:'Undo is available.',actionLabel:'Undo archive'}))
  await expect(page.locator('#origin')).toBeFocused()
  await stack.getByRole('button', {name:'Undo archive',exact:true}).focus()
  await stack.evaluate((el: any) => el.show({id:'new',title:'Another notice',duration:0}))
  await expect(stack.getByRole('button', {name:'Undo archive',exact:true})).toBeFocused()
  await stack.evaluate((el: any) => el.dismiss('new'))
  await stack.evaluate(el => el.setAttribute('label','Updated notifications'))
  await expect(stack.getByRole('button', {name:'Undo archive',exact:true})).toBeFocused()
  await stack.evaluate((el: any) => el.addEventListener('kayf-toast-action', (event: Event) => event.preventDefault(), {once:true}))
  await stack.getByRole('button', {name:'Undo archive',exact:true}).click()
  expect(await stack.evaluate((el: any) => el.count)).toBe(1)
  await stack.getByRole('button', {name:'Undo archive',exact:true}).click()
  expect(await stack.evaluate((el: any) => el.count)).toBe(0)
  await expect(page.locator('#origin')).toBeFocused()
})

test('toast timers pause for hover and keyboard focus then resume', async ({ page }) => {
  await page.clock.install()
  await mount(page, '<button id="outside">Outside</button><kayf-toast-stack inline></kayf-toast-stack>')
  const stack = page.locator('kayf-toast-stack')
  await stack.evaluate((el: any) => el.show({id:'timed',title:'Saved',duration:1000}))
  await stack.locator('li').hover()
  await page.clock.fastForward(5000)
  expect(await stack.evaluate((el: any) => el.count)).toBe(1)
  await stack.getByRole('button', {name:'Dismiss Saved'}).focus()
  await page.mouse.move(0,0)
  await page.clock.fastForward(5000)
  expect(await stack.evaluate((el: any) => el.count)).toBe(1)
  await page.locator('#outside').focus()
  await page.clock.fastForward(1100)
  expect(await stack.evaluate((el: any) => el.count)).toBe(0)
})

test('toast reconnect resumes timers; updates, capacity and escaping stay predictable', async ({ page }) => {
  await page.clock.install()
  await mount(page, '<kayf-toast-stack inline></kayf-toast-stack>')
  const stack = page.locator('kayf-toast-stack')
  await stack.evaluate((el: any) => {
    el.show({id:'timer',title:'First',duration:1000})
    ;(window as any).detachedStack = el
    el.remove()
  })
  await page.clock.fastForward(5000)
  await page.evaluate(() => document.querySelector('#fixture')!.append((window as any).detachedStack))
  expect(await stack.evaluate((el: any) => el.count)).toBe(1)
  await page.clock.fastForward(1100)
  expect(await stack.evaluate((el: any) => el.count)).toBe(0)
  await stack.evaluate((el: any) => {
    (window as any).dismissed = []
    el.addEventListener('kayf-toast-dismiss',(event: CustomEvent) => (window as any).dismissed.push(event.detail))
    for (let index=0;index<6;index++) el.show({id:String(index),title:`Notice ${index}`,duration:0})
    el.show({id:'5',title:'<img src=x onerror=alert(1)>',duration:0})
  })
  expect(await stack.evaluate((el: any) => el.count)).toBe(5)
  await expect(stack.locator('img')).toHaveCount(0)
  expect(await page.evaluate(() => (window as any).dismissed[0])).toEqual({id:'0',reason:'overflow'})
  await stack.evaluate((el: any) => el.clear())
  await expect(stack.locator('li')).toHaveCount(0)
  expect(await stack.evaluate((el: any) => {
    el.show({id:'toast-1',title:'Custom id',duration:0})
    const generated = el.show({title:'Generated id',duration:0})
    return [generated, el.count]
  })).toEqual(['toast-2',2])
})

test('prism outline keeps its center clear and preserves native loading and disabled semantics', async ({ page }) => {
  await mount(page, '<kayf-prism-button variant="outline" color="cyan">Review changes</kayf-prism-button>')
  const prism = page.locator('kayf-prism-button')
  const button = prism.getByRole('button')
  // Regression: the parent's full conic gradient used to paint through the translucent center.
  expect(await button.evaluate(el=>getComputedStyle(el).backgroundImage)).toBe('none')
  await prism.evaluate(el => {
    (window as any).clicks = 0
    el.addEventListener('kayf-click',()=> (window as any).clicks++)
  })
  await button.focus()
  await page.keyboard.press('Enter')
  expect(await page.evaluate(()=> (window as any).clicks)).toBe(1)
  await prism.evaluate(el=>el.setAttribute('loading',''))
  await expect(button).toBeDisabled()
  await prism.evaluate((el: any)=>el.click())
  expect(await page.evaluate(()=> (window as any).clicks)).toBe(1)
  await prism.evaluate(el=>{el.removeAttribute('loading');el.setAttribute('disabled','')})
  await expect(button).toBeDisabled()
  await prism.evaluate(el=>{el.removeAttribute('disabled');el.setAttribute('variant','solid')})
  expect(await button.evaluate(el=>getComputedStyle(el).backgroundImage)).toContain('conic-gradient')
})

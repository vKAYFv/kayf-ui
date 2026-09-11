import { test, expect } from '@playwright/test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const stories = [
  ['components-segmentedcontrol--default', 'kayf-segmented-control'],
  ['components-toaststack--all-tones', 'kayf-toast-stack'],
  ['components-prismbutton--outline', 'kayf-prism-button'],
  ['components-verificationcode--default', 'kayf-verification-code'],
  ['components-filedropzone--default', 'kayf-file-dropzone'],
  ['components-stepper--default', 'kayf-stepper'],
  ['components-phoneinput--default', 'kayf-phone-input'],
  ['components-languageswitcher--compact', 'kayf-language-switcher'],
  ['components-authform--registration', 'kayf-auth-form'],
]
for (const [id, tag] of stories) {
  test(`${id} renders accessibly at desktop and mobile sizes`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(`/storybook/iframe.html?id=${id}&viewMode=story`)
    await expect(page.locator(tag).first()).toBeVisible()
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
    const violations = await page.locator(tag).first().evaluate(async element => {
      const result = await (window as any).axe.run(element, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })
      return result.violations.map((v: any) => ({ id: v.id, nodes: v.nodes.map((n: any) => ({ target: n.target, summary: n.failureSummary })) }))
    })
    expect(violations).toEqual([])
    await page.screenshot({ path: `test-results/${id}-desktop.png`, fullPage: true })
    await page.setViewportSize({ width: 375, height: 812 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expect(page.locator(tag).first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/${id}-mobile.png`, fullPage: true })
    expect(errors).toEqual([])
  })
}

test('guided flow advances and finishes; Storybook play function passes', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=components-stepper--guided-flow&viewMode=story')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.locator('kayf-stepper').getByRole('status')).toHaveText('Step 2 of 3')
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Finish setup' }).click()
  await expect(page.locator('kayf-stepper').getByRole('status')).toHaveText('All steps complete')
  await page.goto('/storybook/iframe.html?id=components-verificationcode--keyboard-entry&viewMode=story')
  await expect(page.getByRole('textbox')).toHaveValue('12345')
  await expect(page.locator('.sb-errordisplay')).not.toBeVisible()
})

test('updated introduction displays the full catalog on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/storybook/iframe.html?id=welcome--introduction&viewMode=story')
  await expect(page.locator('.intro__component')).toHaveCount(24)
  await expect(page.locator('kayf-verification-code')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/introduction-mobile.png', fullPage: true })
})


test('all prism outline colors stay readable across sizes and surfaces', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=components-prismbutton--outline-matrix&viewMode=story')
  await expect(page.locator('kayf-prism-button')).toHaveCount(30)
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')})
  expect(await page.locator('.button-stage').evaluate(async element => (await (window as any).axe.run(element,{runOnly:['color-contrast']})).violations)).toEqual([])
  await page.screenshot({path:'test-results/prism-outline-matrix.png',fullPage:true})
  await page.goto('/storybook/iframe.html?id=components-prismbutton--outline-surfaces&viewMode=story')
  await expect(page.locator('kayf-prism-button')).toHaveCount(3)
  await page.locator('kayf-prism-button').last().getByRole('button').hover()
  await page.screenshot({path:'test-results/prism-outline-surfaces.png',fullPage:true})
})

test('toast demo undoes an archive and restores keyboard focus', async ({ page }) => {
  await page.goto('/storybook/iframe.html?id=components-toaststack--undo-action&viewMode=story')
  const archive = page.getByRole('button',{name:'Archive project',exact:true})
  await archive.click()
  await expect(page.locator('[data-project]')).toHaveText('Project: archived')
  await page.getByRole('button',{name:'Undo archive',exact:true}).click()
  await expect(page.locator('[data-project]')).toHaveText('Project: active')
  await expect(archive).toBeFocused()
})

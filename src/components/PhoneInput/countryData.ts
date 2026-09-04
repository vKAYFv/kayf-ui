/**
 * Compact country/territory metadata snapshot generated from Google libphonenumber.
 * Source: https://github.com/google/libphonenumber/blob/master/resources/PhoneNumberMetadata.xml
 * Non-geographical service codes (region 001) are intentionally excluded.
 */
export interface PhoneCountrySeed {
  code: string
  name: string
  dialCode: string
  example: string
  groups: number[]
  minLength: number
  maxLength: number
  leadingDigits?: string
}

const countryData = `
AC	Ascension Island	247	40123	2,3	5	5	
AD	Andorra	376	312345	3,3	6	9	
AE	United Arab Emirates	971	501234567	2,3,4	9	9	
AF	Afghanistan	93	701234567	2,3,4	9	9	
AG	Antigua & Barbuda	1	2684641234	3,3,4	10	10	268
AI	Anguilla	1	2642351234	3,3,4	10	10	264
AL	Albania	355	672123456	2,3,4	9	9	
AM	Armenia	374	77123456	2,6	8	8	
AO	Angola	244	923123456	3,3,3	9	9	
AR	Argentina	54	91123456789	1,2,4,4	10	11	
AS	American Samoa	1	6847331234	3,3,4	10	10	684
AT	Austria	43	664123456	3,6	7	13	
AU	Australia	61	412345678	3,3,3	9	9	
AW	Aruba	297	5601234	3,4	7	7	
AX	Åland Islands	358	412345678	3,3,3	6	10	18
AZ	Azerbaijan	994	401234567	2,3,2,2	9	9	
BA	Bosnia & Herzegovina	387	61123456	2,3,3	8	9	
BB	Barbados	1	2462501234	3,3,4	10	10	246
BD	Bangladesh	880	1812345678	4,6	10	10	
BE	Belgium	32	450001234	3,2,2,2	9	9	
BF	Burkina Faso	226	70123456	2,2,2,2	8	8	
BG	Bulgaria	359	43012345	2,3,3	8	9	
BH	Bahrain	973	36001234	4,4	8	8	
BI	Burundi	257	79561234	2,2,2,2	8	8	
BJ	Benin	229	0195123456	2,2,2,2,2	10	10	
BL	St. Barthélemy	590	690001234	3,3,3	9	9	
BM	Bermuda	1	4413701234	3,3,4	10	10	441
BN	Brunei	673	7123456	3,4	7	7	
BO	Bolivia	591	71234567	8	8	8	
BQ	Caribbean Netherlands	599	3181234	3,4	7	7	[347]
BR	Brazil	55	11961234567	2,5,4	10	11	
BS	Bahamas	1	2423591234	3,3,4	10	10	242
BT	Bhutan	975	17123456	2,2,2,2	8	8	
BW	Botswana	267	71123456	2,3,3	8	8	
BY	Belarus	375	294911911	2,3,2,2	9	9	
BZ	Belize	501	6221234	3,4	7	7	
CA	Canada	1	5062345678	3,3,4	10	10	
CC	Cocos (Keeling) Islands	61	412345678	3,3,3	9	9	
CD	Congo - Kinshasa	243	991234567	3,3,3	7	9	
CF	Central African Republic	236	70012345	2,2,2,2	8	8	
CG	Congo - Brazzaville	242	061234567	2,3,4	9	9	
CH	Switzerland	41	781234567	2,3,2,2	9	9	
CI	Côte d’Ivoire	225	0123456789	2,2,2,4	10	10	
CK	Cook Islands	682	71234	2,3	5	5	
CL	Chile	56	221234567	1,4,4	9	9	
CM	Cameroon	237	671234567	1,2,2,2,2	9	9	
CN	China	86	13123456789	3,4,4	11	11	
CO	Colombia	57	3211234567	3,7	10	10	
CR	Costa Rica	506	83123456	4,4	8	8	
CU	Cuba	53	51234567	1,7	8	8	
CV	Cape Verde	238	9911234	3,2,2	7	7	
CW	Curaçao	599	95181234	1,3,4	7	8	[69]
CX	Christmas Island	61	412345678	3,3,3	9	9	
CY	Cyprus	357	96123456	2,6	8	8	
CZ	Czechia	420	601123456	3,3,3	9	9	
DE	Germany	49	15123456789	4,7	10	11	
DJ	Djibouti	253	77831001	2,2,2,2	8	8	
DK	Denmark	45	34412345	2,2,2,2	8	8	
DM	Dominica	1	7672251234	3,3,4	10	10	767
DO	Dominican Republic	1	8092345678	3,3,4	10	10	8001|8[024]9
DZ	Algeria	213	551234567	3,2,2,2	9	9	
EC	Ecuador	593	991234567	2,3,4	9	9	
EE	Estonia	372	51234567	4,4	7	8	
EG	Egypt	20	1001234567	2,8	10	10	
EH	Western Sahara	212	650123456	3,3,3	9	9	
ER	Eritrea	291	7123456	1,3,3	7	7	
ES	Spain	34	612345678	3,2,2,2	9	9	
ET	Ethiopia	251	911234567	2,3,4	9	9	
FI	Finland	358	412345678	2,7	6	10	1[03-79]|[2-9]
FJ	Fiji	679	7012345	3,4	7	7	
FK	Falkland Islands	500	51234	2,3	5	5	
FM	Micronesia	691	3501234	3,4	7	7	
FO	Faroe Islands	298	211234	2,2,2	6	6	
FR	France	33	612345678	1,2,2,2,2	9	9	
GA	Gabon	241	06031234	2,2,2,2	7	8	
GB	United Kingdom	44	7400123456	4,6	10	10	
GD	Grenada	1	4734031234	3,3,4	10	10	473
GE	Georgia	995	555123456	3,2,2,2	9	9	
GF	French Guiana	594	694201234	3,2,2,2	9	9	
GG	Guernsey	44	7781123456	3,3,4	10	10	
GH	Ghana	233	231234567	2,3,4	9	9	
GI	Gibraltar	350	57123456	4,4	8	8	
GL	Greenland	299	221234	2,2,2	6	6	
GM	Gambia	220	3012345	3,4	7	9	
GN	Guinea	224	601123456	3,2,2,2	9	9	
GP	Guadeloupe	590	690001234	3,2,2,2	9	9	
GQ	Equatorial Guinea	240	222123456	3,3,3	9	9	
GR	Greece	30	6912345678	3,3,4	10	10	
GT	Guatemala	502	51234567	4,4	8	8	
GU	Guam	1	6713001234	3,3,4	10	10	671
GW	Guinea-Bissau	245	955012345	3,3,3	9	9	
GY	Guyana	592	6091234	3,4	7	7	
HK	Hong Kong SAR China	852	51234567	4,4	8	8	
HN	Honduras	504	91234567	4,4	8	8	
HR	Croatia	385	921234567	2,3,4	8	9	
HT	Haiti	509	34101234	2,2,4	8	8	
HU	Hungary	36	201234567	2,3,4	9	9	
ID	Indonesia	62	812345678	3,3,3	9	12	
IE	Ireland	353	850123456	2,3,4	9	9	
IL	Israel	972	502345678	2,3,4	9	9	
IM	Isle of Man	44	7924123456	3,3,4	10	10	74576|(?:16|7[56])24
IN	India	91	8123456789	5,5	10	10	
IO	British Indian Ocean Territory	246	3801234	3,4	7	7	
IQ	Iraq	964	7912345678	3,3,4	10	10	
IR	Iran	98	9123456789	3,3,4	10	10	
IS	Iceland	354	6111234	3,4	7	9	
IT	Italy	39	3123456789	3,3,4	9	10	
JE	Jersey	44	7797712345	3,3,4	10	10	
JM	Jamaica	1	8762101234	3,3,4	10	10	658|876
JO	Jordan	962	790123456	1,4,4	9	9	
JP	Japan	81	9012345678	2,4,4	10	10	
KE	Kenya	254	712123456	3,6	9	9	
KG	Kyrgyzstan	996	700123456	3,3,3	9	9	
KH	Cambodia	855	91234567	2,3,3	8	9	
KI	Kiribati	686	72001234	4,4	8	8	
KM	Comoros	269	3212345	3,2,2	7	7	
KN	St. Kitts & Nevis	1	8697652917	3,3,4	10	10	869
KP	North Korea	850	1921234567	3,3,4	10	10	
KR	South Korea	82	1020000000	2,4,4	9	10	
KW	Kuwait	965	50012345	3,5	8	8	
KY	Cayman Islands	1	3453231234	3,3,4	10	10	345
KZ	Kazakhstan	7	7710009998	3,3,4	10	10	7
LA	Laos	856	2023123456	2,2,3,3	9	10	
LB	Lebanon	961	71123456	2,3,3	7	8	
LC	St. Lucia	1	7582845678	3,3,4	10	10	758
LI	Liechtenstein	423	660234567	3,3,3	7	9	
LK	Sri Lanka	94	712345678	2,3,4	9	9	
LR	Liberia	231	770123456	2,3,4	7	9	
LS	Lesotho	266	50123456	4,4	8	8	
LT	Lithuania	370	61234567	3,5	8	8	
LU	Luxembourg	352	628123456	3,3,3	9	9	
LV	Latvia	371	21234567	2,3,3	8	8	
LY	Libya	218	912345678	2,7	9	9	
MA	Morocco	212	650123456	1,2,2,2,2	9	9	[5-8]
MC	Monaco	377	612345678	1,2,2,2,2	8	9	
MD	Moldova	373	62112345	3,2,3	8	8	
ME	Montenegro	382	60123456	2,3,3	8	8	
MF	St. Martin	590	690001234	3,3,3	9	9	
MG	Madagascar	261	321234567	2,2,3,2	9	9	
MH	Marshall Islands	692	2351234	3,4	7	7	
MK	North Macedonia	389	72345678	2,3,3	8	8	
ML	Mali	223	65012345	2,2,2,2	8	8	
MM	Myanmar (Burma)	95	92123456	1,3,4	7	10	
MN	Mongolia	976	88123456	4,4	8	8	
MO	Macao SAR China	853	66123456	4,4	8	8	
MP	Northern Mariana Islands	1	6702345678	3,3,4	10	10	670
MQ	Martinique	596	696201234	3,2,2,2	9	9	
MR	Mauritania	222	22123456	2,2,2,2	8	8	
MS	Montserrat	1	6644923456	3,3,4	10	10	664
MT	Malta	356	96961234	4,4	8	8	
MU	Mauritius	230	52512345	4,4	8	8	
MV	Maldives	960	7712345	3,4	7	7	
MW	Malawi	265	991234567	3,2,2,2	9	9	
MX	Mexico	52	2221234567	3,3,4	10	10	
MY	Malaysia	60	123456789	2,3,4	9	10	
MZ	Mozambique	258	821234567	2,3,4	9	9	
NA	Namibia	264	811234567	2,3,4	9	9	
NC	New Caledonia	687	751234	2,2,2	6	6	
NE	Niger	227	93123456	2,2,2,2	8	8	
NF	Norfolk Island	672	381234	1,5	6	6	
NG	Nigeria	234	8021234567	3,3,4	10	10	
NI	Nicaragua	505	81234567	4,4	8	8	
NL	Netherlands	31	612345678	1,8	9	11	
NO	Norway	47	40612345	2,2,2,2	8	8	[02-689]|7[0-8]
NP	Nepal	977	9841234567	3,7	10	10	
NR	Nauru	674	5551234	3,4	7	7	
NU	Niue	683	8884012	3,4	4	7	
NZ	New Zealand	64	211234567	2,3,4	8	10	
OM	Oman	968	92123456	4,4	8	8	
PA	Panama	507	61234567	4,4	7	8	
PE	Peru	51	912345678	3,3,3	9	9	
PF	French Polynesia	689	87123456	2,2,2,2	8	8	
PG	Papua New Guinea	675	70123456	4,4	8	8	
PH	Philippines	63	9051234567	3,3,4	10	10	
PK	Pakistan	92	3012345678	3,7	10	10	
PL	Poland	48	512345678	3,3,3	9	9	
PM	St. Pierre & Miquelon	508	551234	2,2,2	6	9	
PR	Puerto Rico	1	7872345678	3,3,4	10	10	787|939
PS	Palestinian Territories	970	599123456	3,3,3	9	9	
PT	Portugal	351	912345678	3,3,3	9	9	
PW	Palau	680	6201234	3,4	7	7	
PY	Paraguay	595	961456789	3,6	9	9	
QA	Qatar	974	33123456	4,4	8	8	
RE	Réunion	262	692123456	3,2,2,2	9	9	
RO	Romania	40	712034567	3,3,3	9	9	
RS	Serbia	381	601234567	2,7	8	10	
RU	Russia	7	9123456789	3,3,2,2	10	10	[3489]
RW	Rwanda	250	720123456	3,3,3	9	9	
SA	Saudi Arabia	966	512345678	2,3,4	9	9	
SB	Solomon Islands	677	7421234	2,5	5	7	
SC	Seychelles	248	2510123	1,3,3	7	7	
SD	Sudan	249	911231234	2,3,4	9	9	
SE	Sweden	46	701234567	2,3,2,2	9	9	
SG	Singapore	65	81234567	4,4	8	8	
SH	St. Helena	290	51234	2,3	5	5	[256]
SI	Slovenia	386	31234567	2,3,3	8	8	
SJ	Svalbard & Jan Mayen	47	41234567	4,4	8	8	79
SK	Slovakia	421	912123456	3,3,3	9	9	
SL	Sierra Leone	232	25123456	2,6	8	8	
SM	San Marino	378	66661212	2,2,2,2	8	8	
SN	Senegal	221	701234567	2,3,2,2	9	9	
SO	Somalia	252	71123456	1,7	7	9	
SR	Suriname	597	7412345	3,4	7	7	
SS	South Sudan	211	977123456	3,3,3	9	9	
ST	São Tomé & Príncipe	239	9812345	3,4	7	7	
SV	El Salvador	503	70123456	4,4	8	8	
SX	Sint Maarten	1	7215205678	3,3,4	10	10	721
SY	Syria	963	944567890	3,3,3	9	9	
SZ	Eswatini	268	76123456	4,4	8	8	
TA	Tristan da Cunha	290	8999	3,3,4	4	4	8
TC	Turks & Caicos Islands	1	6492311234	3,3,4	10	10	649
TD	Chad	235	63012345	2,2,2,2	8	8	
TG	Togo	228	90112345	2,2,2,2	8	8	
TH	Thailand	66	812345678	2,3,4	9	9	
TJ	Tajikistan	992	917123456	2,3,4	9	9	
TK	Tokelau	690	7290	3,3,4	4	7	
TL	Timor-Leste	670	77212345	4,4	8	8	
TM	Turkmenistan	993	66123456	2,6	8	8	
TN	Tunisia	216	20123456	2,3,3	8	8	
TO	Tonga	676	7715123	3,4	7	7	
TR	Türkiye	90	5012345678	3,3,2,2	10	10	
TT	Trinidad & Tobago	1	8682911234	3,3,4	10	10	868
TV	Tuvalu	688	901234	2,4	6	7	
TW	Taiwan	886	912345678	3,3,3	9	9	
TZ	Tanzania	255	621234567	3,3,3	9	9	
UA	Ukraine	380	501234567	2,3,4	9	9	
UG	Uganda	256	712345678	3,6	9	9	
US	United States	1	2015550123	3,3,4	10	10	
UY	Uruguay	598	94231234	2,3,3	8	8	
UZ	Uzbekistan	998	912345678	2,3,2,2	9	9	
VA	Vatican City	39	3123456789	3,3,4	9	10	06698
VC	St. Vincent & Grenadines	1	7844301234	3,3,4	10	10	784
VE	Venezuela	58	4121234567	3,7	10	10	
VG	British Virgin Islands	1	2843001234	3,3,4	10	10	284
VI	U.S. Virgin Islands	1	3406421234	3,3,4	10	10	340
VN	Vietnam	84	912345678	3,3,3	9	9	
VU	Vanuatu	678	5912345	3,4	7	7	
WF	Wallis & Futuna	681	821234	2,2,2	6	6	
WS	Samoa	685	7212345	2,5	7	10	
XK	Kosovo	383	43201234	2,3,3	8	8	
YE	Yemen	967	712345678	3,3,3	9	9	
YT	Mayotte	262	639012345	3,3,3	9	9	
ZA	South Africa	27	711234567	2,3,4	5	9	
ZM	Zambia	260	955123456	2,7	9	9	
ZW	Zimbabwe	263	712345678	2,3,4	9	9	
`

export const phoneCountrySeeds: readonly PhoneCountrySeed[] = countryData.trim().split('\n').map(line => {
  const [code, name, dialCode, example, groupData, minLength, maxLength, leadingDigits] = line.split('\t')
  return {
    code,
    name,
    dialCode,
    example,
    groups: groupData.split(',').map(Number),
    minLength: Number(minLength),
    maxLength: Number(maxLength),
    ...(leadingDigits ? { leadingDigits } : {}),
  }
})


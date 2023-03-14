const main = require('../main')
describe('Date re-format', () => {
	it('Converts date to an array', () => {
		jest.useFakeTimers()
		jest.setSystemTime(new Date("2023-03-13"))
		const date = new Date()
		expect(main.newDateFormat(date)).toEqual([2023, 3, 13])
	})
})
// describe('Get Gurpurab', () => {
// 	it('Expects Gurpurab from the day', () => {
// 		jest.useFakeTimers()
// 		jest.setSystemTime(new Date("2022-09-02"))
// 		const date = new Date()
// 		expect(JSON.stringify(main.getGurpurab(date))).toEqual("[{\"pa\":\"ਪਹਿਲਾ ਪ੍ਰਕਾਸ਼ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ\",\"en\":\"First Parkash of Sri Guru Granth Sahib Ji\",\"type\":\"gurpurab\"}]")
// 	})
// })

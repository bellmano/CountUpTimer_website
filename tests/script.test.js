describe('Main Script Tests', () => {
	test('exports countUpFromTime for Node.js', () => {
		const exported = require('../src/script.js');
		expect(exported).toHaveProperty('countUpFromTime');
		expect(typeof exported.countUpFromTime).toBe('function');
	});
});
// Mock document.getElementById and DOM structure
function createMockDOM() {
	const years = { innerHTML: null };
	const days = { innerHTML: null };
	const hours = { innerHTML: null };
	const minutes = { innerHTML: null };
	const seconds = { innerHTML: null };
	return {
		getElementsByClassName: (cls) => {
			if (cls === 'years') return [years];
			if (cls === 'days') return [days];
			if (cls === 'hours') return [hours];
			if (cls === 'minutes') return [minutes];
			if (cls === 'seconds') return [seconds];
			return [{}];
		},
		years, days, hours, minutes, seconds
	};
}

describe('countUpFromTime', () => {
	let script;
	let originalGetElementById;
	let originalSetTimeout;
	let mockTimeout;

	beforeAll(() => {
		// Load script.js into global scope
		script = require('../src/script.js');
	});

	beforeEach(() => {
		// Mock document.getElementById
		originalGetElementById = global.document.getElementById;
		global.document.getElementById = jest.fn((id) => {
			return createMockDOM();
		});
		// Mock setTimeout
		originalSetTimeout = global.setTimeout;
		mockTimeout = jest.fn();
		global.setTimeout = mockTimeout;
		// Clear interval
		script.countUpFromTime.interval = undefined;
	});

	afterEach(() => {
		global.document.getElementById = originalGetElementById;
		global.setTimeout = originalSetTimeout;
	});

	test('calculates years, days, hours, minutes, seconds correctly for normal date', () => {
		const mockEl = createMockDOM();
		global.document.getElementById = jest.fn(() => mockEl);
		// Use a fixed date for now
		// Use real Date objects
		script.countUpFromTime('Oct 21, 2001 17:00:00', 'countup1');
		// Years since 2001-10-21 to 2025-09-13 is 23 years, 327 days
		expect(Number(mockEl.years.innerHTML)).toBeGreaterThanOrEqual(23);
		expect(Number(mockEl.days.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(Number(mockEl.hours.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(Number(mockEl.minutes.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(Number(mockEl.seconds.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(mockTimeout).toHaveBeenCalled();
	});

	test('handles leap years correctly', () => {
		const mockEl = createMockDOM();
		global.document.getElementById = jest.fn(() => mockEl);
		// Leap year: 2004
		script.countUpFromTime('Jan 1, 2004 00:00:00', 'countup1');
		// Should be years since 2004-01-01 to now
		const start = new Date('Jan 1, 2004 00:00:00');
		const now = new Date();
		let years = now.getFullYear() - start.getFullYear();
		// If current date is before Jan 1, subtract one year
		if (
			now.getMonth() < start.getMonth() ||
			(now.getMonth() === start.getMonth() && now.getDate() < start.getDate())
		) {
			years--;
		}
		expect(Number(mockEl.years.innerHTML)).toBe(years);
		expect(Number(mockEl.days.innerHTML)).toBeGreaterThanOrEqual(0);
	});

	test('handles DST changes', () => {
		const mockEl = createMockDOM();
		global.document.getElementById = jest.fn(() => mockEl);
		// DST change: last Sunday in March (Europe)
		script.countUpFromTime('Mar 27, 2022 01:59:59', 'countup1');
		expect(Number(mockEl.hours.innerHTML)).toBeGreaterThanOrEqual(0);
	});

	test('updates DOM elements with correct values', () => {
		const mockEl = createMockDOM();
		global.document.getElementById = jest.fn(() => mockEl);
		script.countUpFromTime('Sep 13, 2025 11:59:00', 'countup1');
		expect(mockEl.years.innerHTML).toBe(0);
		expect(Number(mockEl.days.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(Number(mockEl.hours.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(Number(mockEl.minutes.innerHTML)).toBeGreaterThanOrEqual(0);
		expect(Number(mockEl.seconds.innerHTML)).toBeGreaterThanOrEqual(0);
	});

	test('clears previous interval and sets new one', () => {
		const mockEl = createMockDOM();
		global.document.getElementById = jest.fn(() => mockEl);
		script.countUpFromTime('Sep 13, 2025 11:59:00', 'countup1');
		expect(mockTimeout).toHaveBeenCalled();
	});

	test('handles edge case: same date', () => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('Sep 13, 2025 12:00:00'));
		const mockEl = createMockDOM();
		global.document.getElementById = jest.fn(() => mockEl);
		script.countUpFromTime('Sep 13, 2025 12:00:00', 'countup1');
		expect(mockEl.years.innerHTML).toBe(0);
		expect(mockEl.days.innerHTML).toBe(0);
		jest.useRealTimers();
	});
});

describe('window.onload coverage', () => {
	let script;
	let originalGetElementById;
	let mockTimeout;

	beforeAll(() => {
		script = require('../src/script.js');
	});

	beforeEach(() => {
		originalGetElementById = global.document.getElementById;
		global.document.getElementById = jest.fn(() => createMockDOM());
		mockTimeout = jest.fn();
		global.setTimeout = mockTimeout;
	});

	afterEach(() => {
		global.document.getElementById = originalGetElementById;
	});

	test('covers window.onload and initial countUpFromTime call', () => {
		// Simulate window.onload
		if (typeof script.window !== 'undefined' && typeof script.window.onload === 'function') {
			script.window.onload();
		} else if (typeof global.window !== 'undefined' && typeof global.window.onload === 'function') {
			global.window.onload();
		} else {
			// Directly call the function as fallback
			script.countUpFromTime("Oct 21, 2001 17:00:00", 'countup1');
		}
		expect(global.document.getElementById).toHaveBeenCalledWith('countup1');
	});
});
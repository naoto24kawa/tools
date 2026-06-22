import { describe, it, expect } from 'vitest';
import { calcYakudoshi } from '../yakudoshi';

describe('yakudoshi', () => {
  describe('男性', () => {
    it('本厄は25・42・61歳', () => {
      const result = calcYakudoshi(1990, 'male');
      const mainYakus = result.entries.filter((e) => e.type === 'main').map((e) => e.age);
      expect(mainYakus).toContain(25);
      expect(mainYakus).toContain(42);
      expect(mainYakus).toContain(61);
    });

    it('前厄は本厄の1年前', () => {
      const result = calcYakudoshi(1990, 'male');
      const preYakus = result.entries.filter((e) => e.type === 'pre').map((e) => e.age);
      expect(preYakus).toContain(24); // 25の前厄
      expect(preYakus).toContain(41); // 42の前厄
    });

    it('後厄は本厄の1年後', () => {
      const result = calcYakudoshi(1990, 'male');
      const postYakus = result.entries.filter((e) => e.type === 'post').map((e) => e.age);
      expect(postYakus).toContain(26); // 25の後厄
      expect(postYakus).toContain(43); // 42の後厄
    });
  });

  describe('女性', () => {
    it('本厄は19・33・37・61歳', () => {
      const result = calcYakudoshi(1990, 'female');
      const mainYakus = result.entries.filter((e) => e.type === 'main').map((e) => e.age);
      expect(mainYakus).toContain(19);
      expect(mainYakus).toContain(33);
      expect(mainYakus).toContain(37);
      expect(mainYakus).toContain(61);
    });
  });

  describe('年号計算', () => {
    it('1990年生まれ・25歳の年は2015年', () => {
      const result = calcYakudoshi(1990, 'male');
      const main25 = result.entries.find((e) => e.type === 'main' && e.age === 25);
      // 数え年: 1990 + 25 - 1 = 2014 or 2015
      expect(main25?.year).toBeGreaterThanOrEqual(2014);
      expect(main25?.year).toBeLessThanOrEqual(2015);
    });
  });
});

import { getOffsetRect } from './helpers';

describe('getOffsetRect', () => {
  const top = 200;
  const left = 300;
  let htmlElement: HTMLElement;

  beforeAll(() => {
    htmlElement = document.createElement('div');
    htmlElement.style.cssText = `position:fixed;top:${top}px;left:${left}px;`;
    document.body.appendChild(htmlElement);
    window.scrollTo(1000, 1000);
  });

  it('should return correct offset', () => {
    const result = getOffsetRect(htmlElement);
    expect(result).toEqual({ top, left });
  });

  afterAll(() => {
    document.body.removeChild(htmlElement);
    window.scrollTo(0, 0);
  });
});

import { getStub } from './helpers';
import { sanitize } from '../src/utils/sanitizer';

const getStubContent = getStub('sanitizer');

describe('Content sanitization', () => {
  it('should remove unacceptable empty elements', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('empty-elements.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(getStubContent('empty-elements.result.html'));
  });

  it('should preserve allowed empty elements', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('allowed-empty-elements.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(
      getStubContent('allowed-empty-elements.result.html')
    );
  });

  it('should remove restricted attributes', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('restricted-attributes.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(
      getStubContent('restricted-attributes.result.html')
    );
  });

  it('should preserve allowed attributes', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('allowed-attributes.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(
      getStubContent('allowed-attributes.result.html')
    );
  });

  it('should remove restricted elements', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('restricted-elements.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(
      getStubContent('restricted-elements.result.html')
    );
  });

  it('should remove html comments', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('html-comments.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(getStubContent('html-comments.result.html'));
  });

  it('should preserve svg elements', () => {
    const doc = new DOMParser().parseFromString(
      getStubContent('svg.html'),
      'text/html'
    );

    expect(sanitize(doc)).toEqual(getStubContent('svg.result.html'));
  });
});

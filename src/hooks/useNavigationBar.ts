import { MutableRefObject, RefObject, useEffect } from 'react';
import smoothscroll from 'smoothscroll-polyfill';

const useNavigationBar = <T extends HTMLElement>(
  activatedIndex: number,
  contentRefs: MutableRefObject<Array<RefObject<T>>>,
  scrollIntoViewArg: boolean | ScrollIntoViewOptions | undefined
) => {
  /**
   * Scroll to the activated item
   */
  useEffect(() => {
    smoothscroll.polyfill(); // Enable smooth scrolling on Safari
    contentRefs.current[activatedIndex]?.current?.scrollIntoView(
      scrollIntoViewArg
    );
  }, [activatedIndex]);
};

export default useNavigationBar;

import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import smoothscroll from 'smoothscroll-polyfill';

type UseNavigationBar = {
  activatedIndex: number;
  handleClickTab: (index: number) => void;
};

const useNavigationBar = <T extends HTMLElement>(
  maximumIndex: number,
  contentRefs: MutableRefObject<Array<RefObject<T>>>,
  scrollIntoViewArg: boolean | ScrollIntoViewOptions | undefined,
  observerOptions: IntersectionObserverInit
): UseNavigationBar => {
  const [activatedIndex, setActivatedIndex] = useState<number>(0);
  /**
   * Scroll to the content area corresponding to the activated index after clicking a tab on the navigation bar.
   */
  const handleClickTab = useCallback(
    (index: number) => {
      setActivatedIndex(index);
      smoothscroll.polyfill(); // Enable smooth scrolling on Safari
      contentRefs.current[index]?.current?.scrollIntoView(scrollIntoViewArg);
    },
    [contentRefs, scrollIntoViewArg]
  );

  /**
   * Update the activated index of the category based on the scroll position.
   */
  useEffect(() => {
    const handler: IntersectionObserverCallback = (entries) => {
      /**
       * Immediately after re-rendering, there is at least one entry(content being observed) with isIntersecting===false.
       * Therefore, updating the index right after re-rendering causes an infinite loop.
       * (re-rendering -> at least one entry with isIntersecting===false -> update index -> re-rendering -> ...)
       * (In the exceptional case where all content is within the observation area, page scrolling is not possible.)
       */
      if (entries.length === maximumIndex) return;

      /**
       * When an entry leaves the observation area(entry.isIntersecting===false),
       * the index is updated according to scrolling up or down.
       */
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          /**
           * When scrolling with the scrollIntoView method, the index has already been updated.
           */
          if (entry.target !== contentRefs.current[activatedIndex]?.current)
            return;

          if (entry.boundingClientRect.y < 0)
            setActivatedIndex((prev) =>
              prev + 1 < maximumIndex ? prev + 1 : prev
            );
          else setActivatedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        }
      });
    };

    const observer = new IntersectionObserver(handler, observerOptions);
    contentRefs.current.forEach(
      (ref) => ref.current && observer.observe(ref.current)
    );

    return () => {
      observer.disconnect();
    };
  }, [contentRefs, maximumIndex, observerOptions]);

  return { activatedIndex, handleClickTab };
};

export default useNavigationBar;

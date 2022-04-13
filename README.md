# [React] Dynamic Navigation Bar with IntersectionObserver

![화면_기록_2022-04-13_22_33_35_AdobeCreativeCloudExpress](https://user-images.githubusercontent.com/66267099/163224765-5bec94e9-fb47-44a6-a1e2-1d3dd7c2081a.gif)

図1. [デモ](https://nabepa.github.io/react-navigation-bar/)動画

# IntersectionObserverの簡単な説明

- `IntersectionObserver`は観察範囲内に観察対象(以後，ターゲット)が入るか，つまり観察範囲とターゲットが交差するかを監視
- 概ねの実装はインスタンスの生成とターゲットの登録だけ
    
    ```tsx
    /**
     * インスタンスの生成
     * @handler 交差するターゲットに対して行う処理
     * @observerOptions 観察範囲
     */
    const observer = new IntersectionObserver(handler, observerOptions);
    
    /**
     * ターゲットを登録
     */
    observer.observe(target)
    ```
    
- `handler`に入るのは`IntersectionObserverCallback`
    
    ```tsx
    /**
     * "観察範囲に入っているターゲット"(=entry)に対して行う処理
     * ターゲットが観察範囲に入るとentriesに追加して，離れるとentriesから排除
     * (今回の実装ではobserverを引数として使わないので説明を省略)
     */
    interface IntersectionObserverCallback {
        (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;
    }
    ```
    
- `observerOptions`に入るのは`IntersectionObserverInit`
    
    ```tsx
    /**
     * 観察範囲はroot+rootMargin
     * rootがnullの場合はviewport 
     * rootMarginはcssと同様に設定可能
     * ex) '16px 0px'(ただし，''で囲んで単位は必ずつける)
     * thresholdは0~1から設定
     * 例えば0.8と指定するとターゲットの８割が範囲に入るとentriesに追加して，
     * 2割が範囲から離れるとentriesから排除
     */
    interface IntersectionObserverInit {
        root?: Element | Document | null;
        rootMargin?: string;
        threshold?: number | number[];
    }
    ```
    

# IntersectionObserverで実装

![intersection-observer](https://user-images.githubusercontent.com/66267099/163225132-9238fb24-9c1d-450c-9a6e-7fd9ad0dbfe3.png)

図2. 観察範囲とターゲット

- ナビゲーションバーで活性化された番号がスクローリングによって更新される手順
    1. ページ最上部でナビゲーションの1番が活性化の状態
    2. スクロールダウンしていくと，観察範囲から1番が離れる際に，ナビゲーションバーの2番が活性化
    3. ゆくゆく3番が離れる際に，ナビゲーションバーの4番が活性化
    4. 最下部からスクロールアップしていくと，4番が離れる際に，ナビゲーションバーの3番が活性化
    5. ゆくゆく2番が離れる際に，ナビゲーションバーの1番が活性化
- つまり，ターゲットが観察範囲から離れる度に，ナビゲーションバーで活性化された番号を更新する方法で実装可能
- ターゲットが観察範囲から離れると`entry.isIntersection===false`になり，`entries`から排除される特徴を活用
- コード(未完成)
    
    ```tsx
    import {
      Dispatch,
      MutableRefObject,
      RefObject,
      SetStateAction,
      useEffect,
    } from 'react';
    
    const useNavigationBar = <T extends HTMLElement>(
      activatedIndex: number,
      dispatchIndex: Dispatch<SetStateAction<number>>,
      maximumIndex: number,
      contentRefs: MutableRefObject<Array<RefObject<T>>>,
      scrollIntoViewArg: boolean | ScrollIntoViewOptions | undefined,
      observerOptions: IntersectionObserverInit
    ) => {
      useEffect(() => {
        const handler: IntersectionObserverCallback = (entries) => {
        /**
         * この場所に無限ループの対策ロジックが入る予定
         */
         
        /**
         * handlerの定義
         * 観察範囲から離れるターゲットが観察される度に，
         * スクロールアップ・ダウンによって活性化された番号を更新
         */ 
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            if (entry.boundingClientRect.y < 0)
              dispatchIndex((prev) =>
                prev + 1 < maximumIndex ? prev + 1 : prev
              );
              else dispatchIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
            }
          });
        };
       
        /**
         * handlerと観察範囲を設定してインスタンスを生成
         */
        const observer = new IntersectionObserver(handler, observerOptions);
    
        /**
    		 * ターゲットを登録
    		 */
        contentRefs.current.forEach(
          (ref) => ref.current && observer.observe(ref.current)
        );
    
       /**
        * unmountの際はターゲットを全部削除
        */
       return () => {
         observer.disconnect();
       };
     }, [contentRefs, maximumIndex, dispatchIndex, observerOptions]);
   };
  
   export default useNavigationBar;
   ```
    
- ただし，上記のコードだけでは無限ループが発生

## 無限ループ

### 原因

- 再びレンダーリングされた直後は，ターゲットが観察範囲に入っているかいなかに関わらず`entries`に存在
- それから範囲に入ってないターゲットは`entry.isIntersection===false`になって，`entries`から排除(図2の4番)
- 従って，①レンダーリングされた直後にindexが更新 → ②再びレンダーリングが発火 → ①レンダーリングの直後にindexが更新 → (無限ループ)

### 対策

- `無限ループの対策ロジックが入る予定`の部分に下記を記入
    
    ```tsx
    /**
     * 全てのターゲットがentriesに入るのは再レンダーリングの直後だけ
     * (全てのターゲットが観察範囲に収まる場合もあるが，そもそもスクローリングできないので論外)
     */
    if (entries.length === maximumIndex) return;
    ```
    

## 追加機能: Scroll into view

- ナビゲーションバーのカテゴリを押した際に，該当するターゲットに自動スクローリングする機能

```tsx
import {
  Dispatch,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useEffect,
} from 'react';
import smoothscroll from 'smoothscroll-polyfill';

const useNavigationBar = <T extends HTMLElement>(
  activatedIndex: number,
  dispatchIndex: Dispatch<SetStateAction<number>>,
  maximumIndex: number,
  contentRefs: MutableRefObject<Array<RefObject<T>>>,
  scrollIntoViewArg: boolean | ScrollIntoViewOptions | undefined,
  observerOptions: IntersectionObserverInit
) => {
  /**
   * (追加機能)
   * 親コンポーネントから更新されたactivatedIndexが渡されると発火
   */
  useEffect(() => {
    smoothscroll.polyfill(); // Enable smooth scrolling on Safari
    contentRefs.current[activatedIndex]?.current?.scrollIntoView(
      scrollIntoViewArg
    );
  }, [activatedIndex]);

  useEffect(() => {
    const handler: IntersectionObserverCallback = (entries) => {
      if (entries.length === maximumIndex) return;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          /**
           * この場所に追加の処理が入る予定
           */
          if (entry.target !== contentRefs.current[activatedIndex]?.current)
            return;

          if (entry.boundingClientRect.y < 0)
            dispatchIndex((prev) =>
              prev + 1 < maximumIndex ? prev + 1 : prev
            );
          else dispatchIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
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
  }, [contentRefs, maximumIndex, dispatchIndex, observerOptions]);
};

export default useNavigationBar;
```

### 遭遇したバグ

- 自動スクローリングの際もスクロール位置による`activatedIndex`の更新が発火することでバグ

<img width="1440" alt="스크린샷 2022-04-14 00 35 40" src="https://user-images.githubusercontent.com/66267099/163225235-22521c40-817e-4d0d-b1ba-83067fc2706e.png">

図3. デモページ

- 例えば，図3の状態で ****Where does it come from?**** を押下すると，途中で止まらず最後の ****Where can I get some?**** までスクローリング

### 対策

- `この場所に追加の処理が入る予定`の部分に下記を記入
    
    ```tsx
    /**
     * activatedIndexがすでに更新されている場合は，
     * 観察範囲から離れるターゲット(entry.target)がactivatedIndexに該当するターゲットと相違
     */
    if (entry.target !== contentRefs.current[activatedIndex]?.current)
    	return;
    ```
    

# 参考資料

- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [同じことをJSで実装](https://ics.media/entry/190902/)(従来の方法よりいいところなども整理されていておすすめ)
- [ReactでIntersectionObserverを使った実装例](https://github.com/streamich/react-use/blob/master/src/useIntersection.ts)

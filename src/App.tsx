import styles from './App.module.scss';
import { useState } from 'react';
import {
  Category,
  NavigationBar,
} from './components/partials/NavigationBar/NavigationBar';

const CATEGORY_LIST: Array<Category> = [
  { id: 'category0', title: 'What is Lorem Ipsum?' },
  { id: 'category1', title: 'Where does it come from?' },
  { id: 'category2', title: 'Why do we use it?' },
  { id: 'category3', title: 'Where can I get some?' },
];

const App = () => {
  const [activatedIndex, setActivatedIndex] = useState<number>(0);

  const Content = (randomSeed: number) => (
    <>
      <img
        className={styles['image']}
        src={`https://picsum.photos/400/300?random=${randomSeed}`}
      />
      <span className={styles['text']}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident vero
        sapiente illum qui corporis quaerat harum ipsam distinctio inventore
        maiores. Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
        sequi assumenda quae ipsum expedita! Amet minus reiciendis unde rerum
        neque sequi repellat veniam optio eveniet, cumque nam perspiciatis.
        Sapiente, repudiandae. Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Deserunt obcaecati voluptates quaerat explicabo facere
        fugit consectetur reiciendis suscipit quod totam asperiores, tempora
        delectus ipsa saepe excepturi libero at aperiam! Alias! Lorem ipsum
        dolor sit amet, consectetur adipisicing elit. Provident vero sapiente
        illum qui corporis quaerat harum ipsam distinctio inventore maiores.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Est sequi
        assumenda quae ipsum expedita! Amet minus reiciendis unde rerum neque
        sequi repellat veniam optio eveniet, cumque nam perspiciatis. Sapiente,
        repudiandae. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        Deserunt obcaecati voluptates quaerat explicabo facere fugit consectetur
        reiciendis suscipit quod totam asperiores, tempora delectus ipsa saepe
        excepturi libero at aperiam! Alias!
      </span>
    </>
  );

  return (
    <div className={styles['container-app']}>
      <nav className={styles['navigation']}>
        <p className={styles['caption']}>CONTENTS</p>
        <NavigationBar
          categoryList={CATEGORY_LIST}
          activatedIndex={activatedIndex}
          dispatchIndex={setActivatedIndex}
        />
      </nav>
      <main className={styles['main']}>
        <section className={styles['section-content']}>
          <h1 className={styles['title']}>{CATEGORY_LIST[0]!.title}</h1>
          <div className={styles['content']}>{Content(0)}</div>
        </section>
        <section className={styles['section-content']}>
          <h1 className={styles['title']}>{CATEGORY_LIST[1]!.title}</h1>
          <div className={styles['content']}>{Content(1)}</div>
        </section>
        <section className={styles['section-content']}>
          <h1 className={styles['title']}>{CATEGORY_LIST[2]!.title}</h1>
          <div className={styles['content']}>{Content(2)}</div>
        </section>
        <section className={styles['section-content']}>
          <h1 className={styles['title']}>{CATEGORY_LIST[3]!.title}</h1>
          <div className={styles['content']}>{Content(3)}</div>
        </section>
      </main>
    </div>
  );
};

export default App;

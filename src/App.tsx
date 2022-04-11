import styles from './App.module.scss';
import { useState } from 'react';
import {
  Category,
  NavigationBar,
} from './components/partials/NavigationBar/NavigationBar';

const App = () => {
  const categoryList: Array<Category> = [
    { id: 'category1', title: 'Category 1' },
    { id: 'category2', title: 'Category 2' },
    { id: 'category3', title: 'Category 3' },
  ];
  const [activatedIndex, setActivatedIndex] = useState<number>(0);

  return (
    <div className={styles['container-app']}>
      <header className={styles['header']}>
        <NavigationBar
          categoryList={categoryList}
          activatedIndex={activatedIndex}
          dispatchIndex={setActivatedIndex}
        />
      </header>
    </div>
  );
};

export default App;

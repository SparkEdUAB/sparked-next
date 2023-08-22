// src/stores/CounterStore.ts

import { makeAutoObservable } from "mobx";

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

   increment = () => {
    this.count++;
  };

   decrement = () => {
    this.count--;
  };


}

export default CounterStore;

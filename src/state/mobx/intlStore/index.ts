class CounterStore {
  count = 0;

  constructor() {}

  increment = () => {
    this.count++;
  };

  decrement = () => {
    this.count--;
  };
}

export default CounterStore;

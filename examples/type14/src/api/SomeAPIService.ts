class SomeAPIService {
  invoke() {
    console.log('invoked api service');
  }
}

export const someService = new SomeAPIService();

export { SomeAPIService };

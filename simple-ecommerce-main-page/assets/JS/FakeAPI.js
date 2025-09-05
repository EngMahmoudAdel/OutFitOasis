export class FakeAPI {
  async getProducts(url = "") {
    try {
      let response = await fetch(url);
      let data = await response.json();
      return data;
    } catch (err) {
      if (!this.again) {
        this.again = true;
        return await this.getProducts(url);
      } else {
        console.log(err.message);
        return [];
      }
    }
  }
}

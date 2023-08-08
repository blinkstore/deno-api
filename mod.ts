import OpenAPIClientAxios from "npm:openapi-client-axios";

export class Blinkstore {
  api: OpenAPIClientAxios.default; // Change type as needed

  private baseUrl: string;
  private token: string;
  constructor(
    config = {
      baseUrl: "https://api.blinkstore.xyz/api/",
    },
  ) {
    this.baseUrl = config.baseUrl;
  }

  async connect(): Promise<Blinkstore> {
    let headers: any = {};
    if (this.token) {
      headers["x-tik-session"] = this.token;
    }
    const api = new OpenAPIClientAxios.default({
      definition: `${this.baseUrl}openapi/openapi.json`,
      withServer: {
        "url": `${this.baseUrl}`,
      },
      axiosConfigDefaults: {
        headers,
      },
    });
    this.api = await api.init();
    return this;
  }

  async authenticate(apiKey: any) {
    if (!this.api) {
      await this.connect();
    }
    let authentication = await this.api.BlinkAuthValidate({
      "using": "api",
      ...apiKey,
    });
    this.token = authentication.data.session.id;
    await this.connect(); // Re-initialize client with new token
  }

  async getProfile() {
    let response = await this.api.BlinkProfileGet();
    return response.data;
  }
}

// это имелось в виду?
require("dotenv").config();

export const { PORT = 3000 } = process.env;
export const { TOKEN_SECRET_KEY = "secret-key" } = process.env;

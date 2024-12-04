import type { NextApiRequest, NextApiResponse } from "next";
import { Server, Upload } from "@tus/server";
import { FileStore } from "@tus/file-store";

/**
 * !Important. This will tell Next.js NOT Parse the body as tus requires
 * @see https://nextjs.org/docs/api-routes/request-helpers
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

const tusServer = new Server({
  // `path` needs to match the route declared by the next file router
  path: "/api/upload",
  datastore: new FileStore({ directory: "./files" }),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return tusServer.handle(req, res);
}

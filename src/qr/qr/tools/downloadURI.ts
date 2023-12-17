import axios from "axios";

export default async function downloadURI(uri: string, name: string) {
  const resp = await axios.get(uri);
  //console.log(Buffer.from(resp.data));
  return Buffer.from(resp.data);
}

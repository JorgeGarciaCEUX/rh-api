export interface ApiResponse {
  result: "ok" | "error" | "warning" | "unauthorized";
  tit: string;
  msg: string;
  data?: any;
}

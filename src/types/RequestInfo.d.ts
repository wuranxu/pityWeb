interface RequestProps {
  index: number;
  url: string;
  request_method: string;
  status_code: number | string;
  response_headers: string;
  request_headers: string;
  body: string;
}

declare const RequestInfo: RequestProps;

export default RequestInfo;

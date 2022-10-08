import * as requestIp from 'request-ip';

export const logFormat = (
  req: any,
  data,
  status: number,
  requestID: string,
  timestamp: number
) => {
  const ip = requestIp.getClientIp(req);
  return `
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    Token: ${req.headers['authorization'] ?? '未登录'}
    User: ${JSON.stringify(req.user || {})}
    IP: ${ip}
    RequestId: ${requestID}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    Time: ${Date.now() - timestamp} ms
    Status code: ${status}
    Response: ${JSON.stringify(data)} 
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    `;
};

import Cors from 'cors';


 // eslint-disable-next-line @typescript-eslint/no-explicit-any
function initMiddleware(middleware: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// Initialize the CORS middleware
const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // allowed methods
    origin: '*', // allow any origin for simplicity (you should restrict this in production)
    optionsSuccessStatus: 200, // legacy browsers support
  })
);

export default cors;

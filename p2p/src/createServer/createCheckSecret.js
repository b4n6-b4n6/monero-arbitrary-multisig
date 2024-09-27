export const createCheckSecret = ({ secret }) => async (ctx, next) => {
  if (secret !== JSON.parse(ctx.request.body).secret) {
    console.error("wrong secret");
    ctx.status = 500;
  } else {
    await next();
  }
};

export function formatPrice(price: number) {
  return new Intl.NumberFormat("us-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function throwErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "Error" in error) {
    const failed = error.Error;
    if (failed && typeof failed === "object" && "Message" in failed)
      throw new Error(String(failed.Message));
  }
  throw new Error(JSON.stringify(error));
}

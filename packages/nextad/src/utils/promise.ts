export const getSuccessfulResults = <T>(
  results: PromiseSettledResult<T>[]
): T[] => {
  return results
    .filter(
      (result): result is PromiseFulfilledResult<T> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
};

export const getFailedResults = <T>(
  results: PromiseSettledResult<T>[]
): any[] => {
  return results
    .filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    )
    .map((result) => result.reason);
};

export const isAllSuccessful = <T>(
  results: PromiseSettledResult<T>[]
): boolean => {
  return results.every((result) => result.status === "fulfilled");
};

export const hasAnySuccess = <T>(
  results: PromiseSettledResult<T>[]
): boolean => {
  return results.some((result) => result.status === "fulfilled");
};

export const partitionResults = <T>(
  results: PromiseSettledResult<T>[]
): [T[], any[]] => {
  return [getSuccessfulResults(results), getFailedResults(results)];
};

export const allSettledWithTimeout = async <T>(
  promises: Promise<T>[],
  timeoutMs: number
): Promise<PromiseSettledResult<T>[]> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(
      () => reject(new Error(`Operation timed out after ${timeoutMs}ms`)),
      timeoutMs
    );
  });

  try {
    return (await Promise.race([
      Promise.allSettled(promises),
      timeoutPromise,
    ])) as PromiseSettledResult<T>[];
  } catch (error) {
    return promises.map(() => ({
      status: "rejected" as const,
      reason: error,
    }));
  }
};

export const allSettledWithRetry = async <T>(
  promiseFactories: (() => Promise<T>)[],
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<PromiseSettledResult<T>[]> => {
  const results: PromiseSettledResult<T>[] = [];

  for (const factory of promiseFactories) {
    let attempts = 0;
    let lastError: any;

    while (attempts < maxRetries) {
      try {
        const result = await factory();
        results.push({
          status: "fulfilled",
          value: result,
        });
        break;
      } catch (error) {
        lastError = error;
        attempts++;
        if (attempts < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    if (attempts === maxRetries) {
      results.push({
        status: "rejected",
        reason: lastError,
      });
    }
  }

  return results;
};

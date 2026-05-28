import time
from typing import Callable, Tuple, Any


def retry_with_backoff(
    func: Callable[[], Any],
    retries: int = 3,
    delay: int = 2
) -> Tuple[Any, int]:

    last_error = None

    for attempt in range(retries):

        try:
            result = func()
            return result, attempt

        except Exception as e:

            last_error = e

            print(f"Retry {attempt + 1} failed: {e}")

            time.sleep(delay * (2 ** attempt))

    raise Exception(f"All retries failed: {last_error}")
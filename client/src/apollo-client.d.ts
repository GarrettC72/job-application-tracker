// This import is necessary to ensure all Apollo Client imports
// are still available to the rest of the application.
import "@apollo/client";

declare module "@apollo/client" {
  interface DataMasking {
    enabled: true;
  }
}

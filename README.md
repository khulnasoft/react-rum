# Kengine React Real User Monitoring
[![Documentation][docs_badge]][docs]
[![Latest Release][release_badge]][release]
[![License][license_badge]][license]

[Kengine](https://kengine.khulnasoft.com) enables observability for the next generation of cloud applications.

This library enables you to monitor real-user behaviour of your React and Next.js applications. 

## Usage

```bash
npm i --save @khulnasoft/react-rum
```

Add the `KengineRum` Component at the root of your React application application.

> Get the `publicApiKey` from the Kengine console. Make sure to use a public API key.


```tsx

function Page({ child }) {

return (
    <KengineRum apiKey={publicApiKey}>
        {child}
    </KengineRum>)
}
```

The following data is automatically captured for every page view of your application:
- `timezone`
- `language`
- `os`
- `userAgent`
- `url`
- `device`
- `country`
- `city`

## Web Vitals

Additionally, you can enable capturing [web vitals](https://web.dev/vitals/) from your React applications. Use the `enableWebVitals` prop.

- [Time To First Byte (TTFB)](https://web.dev/ttfb/)
- [Largest Contentful Paint (LCP)](https://web.dev/lcp/)
- [First Input Delay (FID)](https://web.dev/fid/)
- [Cumulative Layout Shift (CLS)](https://web.dev/cls/)

Load this at the top of your application to avoid resending the web vital data. 

```tsx
import { KengineRum } from '@khulnasoft/react-rum';

function Page({ child }) {

return (
    <KengineRum apiKey={publicApiKey} enableWebVitals>
        {child}
    </KengineRum>)
}
```

---

## Capture Errors

KengineRum automatically captures and sends any Unhandled Errors in your application to Kengine.

```tsx
import { KengineRum } from '@khulnasoft/react-rum';

function Page({ child }) {

return (
    <KengineRum apiKey={publicApiKey} enableWebVitals fallback={<div>Something went wrong</div>}>
        {child}
    </KengineRum>)
}
```

### Error Boundaries

To provide a better UX for end users, use React [Error Boundaries](https://legacy.reactjs.org/docs/error-boundaries.html#introducing-error-boundaries).

The KengineErrorBoundary catches errors in any of its child components, reports the error to Kengine. It works in conjunction with the `<KengineRum />` Component so that all errors are correlated by Page Load, and User Session.


```jsx
import { KengineErrorBoundary } from '@khulnasoft/react-rum';

function UserProfile({ child }) {

return (<KengineErrorBoundary fallback={<div>Could not display your user profile</div>}>
            <UserProfileImage />
            <UserName />
            <UserBiography />
        </KengineErrorBoundary>
    )
}
```


> This is based on the excellent [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) project.


### Capture Exceptions

Error Boundaries do not catch [errors inside event handlers](https://legacy.reactjs.org/docs/error-boundaries.html#how-about-event-handlers). To catch Exceptions 

```jsx
import { useKengineRum } from '@khulnasoft/react-rum';

function MyButtonComponent() {
    const { captureException } = useKengineRum();

    function handleClick(e) {
        try { 
                 // Do something that could throw  
        } catch (error) {
            // sends errors to Kengine so they can be fixed   
            captureException(error)
       }
    }

    return <button onClick={handleClick}>Click Me</button>
}
```
---

## Custom Events

Capture custom events for analytics and monitoring. Like logs but with all the power of Kengine.

`sendEvent(message: string, payload)`

```jsx
import { useKengineRum } from '@khulnasoft/react-rum';

function CheckoutComponent() {
    const { sendEvent } = useKengineRum();

    function handleClick() {

        const checkoutSession = await createImaginaryCheckoutSession()
        sendEvent("Checkout Started", {
            ...checkoutSession
        })
    }

    return <button onClick={handleClick}>Checkout</button>
}

```

---
## Setting the active user

To set the User from another component then call

```tsx
import { useKengineRum } from '@khulnasoft/react-rum';

function UserCard({ child }) {
    const { setUser } = useKengineRum();

    function login(user) {

        setUser(user.id);
    }
    return (
        <Button onClick={login}>Login</Button>
    }
```


## Using your data

Once the data is captured, you can query, search and analyse your data in the [Kengine console](https://console.kengine.khulnasoft.com). You can create dashboards and alerts based on the Real User Monitoring metrics.

## Props

| Parameter           | Description                                                                     |
|---------------------|---------------------------------------------------------------------------------|
| `apiKey`            | Your Kengine API key for authentication and authorization.                     |
| `enableWebVitals`   | (Optional) A boolean flag indicating whether to enable tracking of web vitals.  |
| `enableLocal`       | (Optional) A boolean flag indicating whether to enable local tracking.          |
| `dataset`           | (Optional) The dataset to store the data to. Defaults to `web`.                 |
| `service`           | The name of the application being monitored. Defaults to the hostname.          |
| `fallback`          | A fallback UI component in case the application crashes                         |

## License

&copy; Kengine Limited, 2023

Distributed under MIT License (`The MIT License`).

See [LICENSE](LICENSE) for more information.

<!-- Badges -->

[docs]: https://kengine.khulnasoft.com/docs/
[docs_badge]: https://img.shields.io/badge/docs-reference-blue.svg?style=flat-square
[release]: https://github.com/khulnasoft/react-rum/releases/latest
[release_badge]: https://img.shields.io/github/release/khulnasoft/react-rum.svg?style=flat-square&ghcache=unused
[license]: https://opensource.org/licenses/MIT
[license_badge]: https://img.shields.io/github/license/khulnasoft/react-rum.svg?color=blue&style=flat-square&ghcache=unused

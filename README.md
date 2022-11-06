# PoC: process CSS tagged template CSS literals with Parcel

```js
const styles = css`
  p {
    color: blue;
  }
`;
```

is bundled into

```js
(()=>{const o=css`p{color:#00f}`;console.log(o)})();
```
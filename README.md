# PoC: process CSS tagged template CSS literals with Parcel

https://github.com/parcel-bundler/parcel/discussions/8504#discussioncomment-4066510

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
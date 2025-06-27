# Netlify Deployment Fix

## Issue

The Netlify deployment was failing with an `ETARGET` error indicating that there was no matching version found for the package `tempus@^0.0.38`. 

Error message:
```
npm error code ETARGET
npm error notarget No matching version found for tempus@^0.0.38.
npm error notarget In most cases you or one of your dependencies are requesting a package version that doesn't exist.
```

## Solution

The issue was resolved by updating the dependency in `package.json` from `tempus@^0.0.38` to `@darkroom.engineering/tempus@^0.0.46`.

### Changes Made

1. Updated `package.json` to use the correct package name and version:
   - Changed `"tempus": "^0.0.38"` to `"@darkroom.engineering/tempus": "^0.0.46"`

### Explanation

The `tempus` package at version `0.0.38` does not exist in the npm registry. However, the package is available under the namespace `@darkroom.engineering/tempus` with version `0.0.46`. 

According to the npm registry, `@darkroom.engineering/tempus` has been renamed to `tempus`, but the specific version `0.0.38` requested in the original `package.json` is not available. By updating to the namespaced version that does exist (`@darkroom.engineering/tempus@^0.0.46`), we ensure that Netlify can successfully install all dependencies during deployment.

## Next Steps

1. Run `npm install` locally to update your `package-lock.json` file
2. Commit and push the changes to your repository
3. Trigger a new Netlify deployment

## Future Considerations

In the future, you may want to consider updating to the latest version of the `tempus` package (without the namespace) once your application is stable with the current fix. The package maintainers recommend using `npm install tempus` for the latest version.
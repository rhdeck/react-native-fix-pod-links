# react-native-fix-pod-links

Focused plugin to help with developing React Native static modules that have CocoaPod dependencies (using [react-native-pods](https://npmjs.com/react-native-pods) maybe?)

This will edit the header search path to add an absolute reference from your linked module to your app's ios/Pods path.

As a result, you get to use linked libraries stored anywhere in the tree you want, and they will have the correct path "back" to the app's additional dependencies.

# Installation

## Global (kinda convenient for dev)

```
yarn global add react-native-fix-pod-links
```

## Per-app (useful for sharing)

```
yarn add react-native-fix-pod-links
```

# Usage

Assuming you have a library and app stored at, say:

```
/Users/me/Documents/module
/Users/me/Documents/testapp
```

And you want to be able to develop module in-place while running through testapp.

Presumably you have already done:

```
cd /Users/me/Documents/testapp
yarn add link:/Users/me/Documents/module
```

(There are multiple ways to get the above effect, but this will do for now)

Now try building your app. If it is failing because of a dependency on CocoaPod, you just:

```
cd /Users/me/Documents/testapp
react-native-fix-pod-links
```

Switch back over to xcode. It builds!

# Shorter format

Want to save some keystrokes? Try just typing:

```
rnfpl
```

# Undo

_Important_ you problably don't want to keep these absolute links for all time - not helpful for distribution, for example. Easily remove them.

```
cd /Users/me/Documents/testapp
rnfpl -u
```

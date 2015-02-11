# AngularJS Packery Directive 

An [AngularJS](http://angularjs.org/) directive to work with David Desandro's [Packery](http://packery.metafizzy.co/).

## Usage

1. `bower install --save git@github.com:htapal/angular-packery.git`
2. Add `wu.packery` to your application's module dependencies.
2. Include dependencies in your HTML.
3. Use the `packery` directive.

## Example

```html
<div packery>
    <div class="packery-brick" ng-repeat="brick in bricks">
        <img ng-src="{{ brick.src }}" alt="A packery brick">
    </div>
</div>
```

You have to include the `packery` attribute on the element holding the bricks.
The bricks are registered at the directive through the `packery-brick` CSS
classname.

The directive uses [`imagesloaded`](https://github.com/desandro/imagesloaded) to
determine when all images within the `packery-brick` have been loaded and adds
the `loaded` CSS class to to the element, so you can add custom styles and
prevent ghosting effects.

## Attributes

### `item-selector`

(Default: `.packery-brick`)

You can specify a different [item
selector](http://packery.metafizzy.co/options.html#itemselector) through the
`item-selector` attribute. You still need to use `packery-brick` either as class
name or element attribute on sub-elements in order to register it to the
directive.

*Example:*

```html
<packery item-selector=".mybrick">
    <div packery-brick class="mybrick">Unicorns</div>
    <div packery-brick class="mybrick">Sparkles</div>
</packery>
```

### `column-width`

The `column-width` attribute allows you to override the [the width of a column
of a horizontal grid](http://packery.metafizzy.co/options.html#columnwidth). If
not set, Packery will use the outer width of the first element.

*Example:*

```html
<packery column-width="200">
    <div class="packery-brick">This will be 200px wide max.</div>
</packery>
```

### `preserve-order`

The `preserve-order` attributes disables the `imagesLoaded` logic and will
instead display bricks by the order in the DOM instead of by the time they are
loaded. Be aware that this can lead to visual glitches if the size of the
elements isn't set at the time they are inserted.

*Example:*

```html
<packery preserve-order>
    <div class="packery-brick"><img src="..." alt="Will always be shown 1st"></div>
    <div class="packery-brick"><img src="..." alt="Will always be shown 2nd"></div>
</packery>
```

### `load-images`

This attribute defaults to `true` and allows to disable the use of `imagesLoaded`
altogether, so you don't have to include the dependency if your packery layout
doesn't actually make use of images.

*Example:*

```html
<packery load-images="false">
    <div class="packery-brick"><p>Only text.</p></div>
    <div class="packery-brick"><p>And nothing but text.</p></div>
</packery>
```

### `reload-on-show`

The `reload-on-show` attribute triggers a reload when the packery element (or an
ancestor element) is shown after being hidden, useful when using `ng-show` or 
`ng-hide`. Without this if the viewport is resized while the packery element is 
hidden it may not render properly when shown again.

*Example:*

```html
<packery reload-on-show ng-show="showList">
    <div class="packery-brick">...</div>
    <div class="packery-brick">...</div>
</packery>
```

When `showList` changes from falsey to truthy `ctrl.reload` will be called.

### `packery-options`

You can provide [additional options](http://packery.metafizzy.co/options.html)
as expression either as `packery` or `packery-options` attribute.

*Example:*

```html
<packery packery-options="{ transitionDuration: '0.4s' }">
</packery>
```

Equivalent to:

```html
<div packery="{ transitionDuration: '0.4s' }">
</div>
```

## Credits

The directive is based on
[angular-masonry](https://github.com/passy/angular-masonry)
by Pascal Hartig


## Contributing

Pull requests welcome. Only change files in `src` and don't bump any versions.
Please respect the code style in place. Follow the
[AngularJS commit guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit-message-format).

## License

MIT


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/passy/angular-packery/trend.png)](https://bitdeli.com/free "Bitdeli Badge")


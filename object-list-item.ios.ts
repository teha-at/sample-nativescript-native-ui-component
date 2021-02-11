import {
    Counter,
    CounterM,
    CounterP1,
    CounterP2,
    CounterP3,
    CounterP4,
    CounterP5,
    CounterP6,
    CounterP7,
    CounterP8,
    CounterT,
    itemProperty,
    ObjectListItemBase,
} from './object-list-item.common';
import {knownFolders} from '@nativescript/core';
import {ObjectModel} from './object.model';

export class ObjectListItem extends ObjectListItemBase {

    // added for TypeScript intellisense.
    nativeView: UIView;

    // height of the hole row
    // "height" property is used in this class and also to set the height of the native view
    public height: number = 90;

    // width of the image container, from the left edge to the "text column"
    private readonly widthImageContainer: number = 60;

    // image size. width = height
    private readonly imageWidthHeight: number = 40;

    private nameUiLabel: UILabel;
    private noticeUiLabel: UILabel;
    private uiImageView: UIImageView;
    private symbolCounter: UILabel;
    private symbolFavoriteUiLabel: UILabel;

    /**
     * Creates new native button.
     */
    public createNativeView(): Object {
        const mainUiStackView = UIStackView.new();
        mainUiStackView.axis = UILayoutConstraintAxis.Horizontal;
        mainUiStackView.alignment = UIStackViewAlignment.Center;

        const placeholder = knownFolders.currentApp().getFolder('images').getFile('building-grey.png').path;
        let image = UIImage.alloc().initWithContentsOfFile(placeholder);
        image = this.imageResize(image, this.imageWidthHeight);
        image = image.imageWithAlignmentRectInsets({
            top: -((this.height - this.imageWidthHeight) / 2),
            left: -((this.widthImageContainer - this.imageWidthHeight) / 2),
            bottom: 0,
            right: 0
        });

        this.uiImageView = UIImageView.alloc().initWithImage(image);
        this.uiImageView.translatesAutoresizingMaskIntoConstraints = false;
        this.uiImageView.layer.cornerRadius = this.imageWidthHeight / 2;
        this.uiImageView.clipsToBounds = true;

        // need a UIView-Parent for the UIImageView otherwise the style was corrupted
        const uiViewImageParent = UIView.alloc().init();
        uiViewImageParent.addSubview(this.uiImageView);


        const secondColumnUiStackView = UIStackView.new();
        secondColumnUiStackView.axis = UILayoutConstraintAxis.Vertical;
        secondColumnUiStackView.distribution = UIStackViewDistribution.FillEqually;

        this.nameUiLabel = UILabel.new();
        this.nameUiLabel.text = this.item?.name;
        this.nameUiLabel.numberOfLines = 1;
        this.nameUiLabel.adjustsFontSizeToFitWidth = false;
        this.nameUiLabel.lineBreakMode = NSLineBreakMode.ByTruncatingTail;
        this.nameUiLabel.translatesAutoresizingMaskIntoConstraints = false;

        const favoriteFontAttribute = NSMutableDictionary.alloc().init();
        favoriteFontAttribute.setValueForKey(UIFont.fontWithNameSize('Font Awesome 5 Free Solid', UIFont.systemFontSize + 2), NSFontAttributeName);
        favoriteFontAttribute.setValueForKey(this.hexToUIColor('#ffee78'), NSForegroundColorAttributeName);
        this.symbolFavoriteUiLabel = UILabel.new();
        this.symbolFavoriteUiLabel.numberOfLines = 1;
        this.symbolFavoriteUiLabel.adjustsFontSizeToFitWidth = false;
        this.symbolFavoriteUiLabel.attributedText = NSMutableAttributedString.alloc().initWithStringAttributes('\u{f005} ', favoriteFontAttribute.copy());
        this.symbolFavoriteUiLabel.translatesAutoresizingMaskIntoConstraints = false;

        const line1Stack = UIStackView.new();
        line1Stack.axis = UILayoutConstraintAxis.Horizontal;
        line1Stack.addArrangedSubview(this.nameUiLabel);
        line1Stack.addArrangedSubview(this.symbolFavoriteUiLabel);
        line1Stack.distribution = UIStackViewDistribution.EqualSpacing;
        secondColumnUiStackView.addArrangedSubview(line1Stack);

        this.noticeUiLabel = UILabel.new();
        this.noticeUiLabel.text = this.item?.notice;
        this.noticeUiLabel.numberOfLines = 1;
        this.noticeUiLabel.adjustsFontSizeToFitWidth = false;
        this.noticeUiLabel.lineBreakMode = NSLineBreakMode.ByTruncatingTail;
        this.noticeUiLabel.translatesAutoresizingMaskIntoConstraints = false;
        secondColumnUiStackView.addArrangedSubview(this.noticeUiLabel);

        this.symbolCounter = UILabel.new();
        this.symbolCounter.lineBreakMode = NSLineBreakMode.ByWordWrapping;
        this.symbolCounter.numberOfLines = 0;
        this.symbolCounter.adjustsFontSizeToFitWidth = false;
        this.symbolCounter.translatesAutoresizingMaskIntoConstraints = false;

        this.symbolCounter.attributedText = NSMutableAttributedString.alloc().initWithString('');
        secondColumnUiStackView.addArrangedSubview(this.symbolCounter);


        NSLayoutConstraint.activateConstraints([
            uiViewImageParent.widthAnchor.constraintEqualToConstant(this.widthImageContainer),
            uiViewImageParent.heightAnchor.constraintEqualToConstant(this.height),
        ]);
        mainUiStackView.addArrangedSubview(uiViewImageParent);

        NSLayoutConstraint.activateConstraints([
            secondColumnUiStackView.heightAnchor.constraintEqualToConstant(this.height),
        ]);
        mainUiStackView.addArrangedSubview(secondColumnUiStackView);

        return mainUiStackView;
    }

    protected imageResize(image: UIImage, targetSize: number): UIImage | null {
        let rect = {origin: {x: 0, y: 0}, size: {width: targetSize, height: targetSize}};

        UIGraphicsBeginImageContextWithOptions({width: targetSize, height: targetSize}, false, 0);
        image?.drawInRect(rect);
        let newImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();

        return newImage;
    }

    protected updateSymbolCounter(values: Array<{ type: Counter, value: number }>) {
        const zerofill = (nb, minLength) => nb.toString().padStart(minLength, ' ');

        let fontAttributeText = NSMutableDictionary.alloc().init();
        fontAttributeText.setValueForKey(UIFont.systemFontOfSize(UIFont.systemFontSize + 2), NSFontAttributeName);

        let fontAttributeNumbers = NSMutableDictionary.alloc().init();
        fontAttributeNumbers.setValueForKey(UIFont.systemFontOfSize(UIFont.systemFontSize + 2), NSFontAttributeName);

        let symbolTextLine = NSMutableAttributedString.alloc().initWithStringAttributes('', fontAttributeText.copy());

        values.forEach((value, index) => {
            const style = this.getStyle(value);
            let fontAttribute = NSMutableDictionary.alloc().init();
            fontAttribute.setValueForKey(UIFont.fontWithNameSize('Font Awesome 5 Free Solid', UIFont.systemFontSize + 2), NSFontAttributeName);
            fontAttribute.setValueForKey(this.hexToUIColor(style.color), NSForegroundColorAttributeName);
            let attributedTextAlarm = NSMutableAttributedString.alloc().initWithStringAttributes(style.icon, fontAttribute.copy());

            symbolTextLine.appendAttributedString(attributedTextAlarm);
            symbolTextLine.appendAttributedString(NSMutableAttributedString.alloc().initWithStringAttributes(zerofill(value.value, 3) + '  ', fontAttributeNumbers.copy()));
        });

        this.symbolCounter.attributedText = symbolTextLine;
    }

    private getStyle(value: { type: Counter; value: number }) {
        return [
            CounterP1,
            CounterP2,
            CounterP3,
            CounterP4,
            CounterP5,
            CounterP6,
            CounterP7,
            CounterP8,
            CounterT,
            CounterM,
        ].find(f => f.type === value.type);
    }

    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void {
        // Attach the owner to nativeView.
        // When nativeView is tapped we get the owning JS object through this field.
        (<any>this.nativeView).owner = this;
        super.initNativeView();
    }

    /**
     * Clean up references to the native view and resets nativeView to its original state.
     * If you have changed nativeView in some other way except through setNative callbacks
     * you have a chance here to revert it back to its original state
     * so that it could be reused later.
     */
    disposeNativeView(): void {
        // Remove reference from native listener to this instance.
        (<any>this.nativeView).owner = null;

        // If you want to recycle nativeView and have modified the nativeView
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
        super.disposeNativeView();
    }

    [itemProperty.setNative](item: ObjectModel) {
        this.item = item;
        this.updateContent();
    }

    private updateContent() {
        this.nameUiLabel.text = this.item?.name;
        this.noticeUiLabel.text = this.item?.notice;
        if (this.item.picture) {
            let image = UIImage.alloc().initWithContentsOfFile('' + this.item.picture);
            image = this.imageResize(image, this.imageWidthHeight);

            this.uiImageView.layer.cornerRadius = this.imageWidthHeight / 2;
            this.uiImageView.clipsToBounds = true;

            image = image.imageWithAlignmentRectInsets({
                top: -((this.height - this.imageWidthHeight) / 2),
                left: -((this.widthImageContainer - this.imageWidthHeight) / 2),
                bottom: 0,
                right: 0
            });

            this.uiImageView.image = image;
        }

        this.updateSymbolCounter(
            [
                CounterP1,
                CounterP2,
                CounterP3,
                CounterP4,
                CounterP5,
                CounterP6,
                CounterP7,
                CounterP8,
                CounterT,
                CounterM,
            ]
                .map(c => ({type: <Counter><unknown>c, value: parseInt(String(Math.random() * 50))}))
        );

        this.symbolFavoriteUiLabel.hidden = !this.item.isFavorite;
    }
}

import BaserElement = require('./BaserElement');
import FormElement = require('./FormElement');
import ITextField = require('../Interface/ITextField');
import TextFieldOption = require('../Interface/TextFieldOption');

/**
 * テキストフィールドの拡張クラス
 *
 * @version 0.9.0
 * @since 0.4.0
 *
 */
class TextField extends FormElement implements ITextField {

	/**
	 * オプションのデフォルト値
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public static defaultOption: TextFieldOption = {};

	/**
	 * TextField要素のクラス
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public static classNameTextField: string = 'form-text-field';

	/**
	 * 未入力状態に付加されるクラス
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public static classNameStateUninput: string = 'uninput';

	/**
	 * プレースホルダー属性に対応しているかどうか
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public static supportPlaceholder: boolean = $('<input />').prop('placeholder') !== undefined;

	/**
	 * 管理するDOM要素
	 *
	 * @override
	 * @version 0.9.0
	 * @since 0.9.0
	 *
	 */
	public el: HTMLInputElement | HTMLTextAreaElement;

	/**
	 * 空かどうか
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public isEmpty: boolean;
	/**
	 * プレースホルダーテキスト
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public placeholder: string = '';

	/**
	 * プレースホルダーをもっているかどうか
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	public hasPlaceholder: boolean;

	/**
	 * オプション情報
	 *
	 * @since 0.4.1
	 *
	 */
	protected _config: TextFieldOption;

	/**
	 * コンストラクタ
	 *
	 * use: jQuery
	 *
	 * @version 0.9.0
	 * @since 0.4.0
	 * @param el 管理するDOM要素
	 * @param options オプション
	 *
	 */
	constructor (el: HTMLInputElement | HTMLTextAreaElement, options: TextFieldOption) {

		super(el, $.extend({}, TextField.defaultOption, options));

		// 既にエレメント化されていた場合は何もしない
		if (this._elementized) {
			return;
		}

		// IE6・7は反映させない
		if (!el.querySelector) {
			return;
		}

		this.placeholder = this.$el.attr('placeholder') || '';
		this.hasPlaceholder = !!this.placeholder;

		this._update();
	}

	/**
	 * クラス名を設定する
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 * @override
	 *
	 */
	protected _setClassName (): void {
		super._setClassName();
		// セレクトボックス用のクラス名を設定
		this.addClass(TextField.classNameTextField);
	}

	/**
	 * ラップ要素を生成
	 *
	 * use: jQuery
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 * @override
	 *
	 */
	protected _createWrapper (): void {
		super._createWrapper();
		BaserElement.addClassTo(this.$wrapper, TextField.classNameTextField + '-' + FormElement.classNameWrapper);
	}

	/**
	 * イベントの登録
	 *
	 * use: jQuery
	 *
	 * @version 0.4.1
	 * @since 0.4.0
	 * @override
	 *
	 */
	protected _bindEvents (): void {
		super._bindEvents();

		// keyupイベントが起こった場合に実行するルーチン
		$(document).on('keyup.bcTextField-' + this.id, (e: JQueryKeyEventObject): void => {
			if (this.hasFocus) {
				this._update();
			}
		});

		// プレースホルダーをサポートしていない時のイベント処理
		if (!TextField.supportPlaceholder) {
			// フォーカスを当てた時・クリックをしたときにプレースホルダーと値が同じだった場合
			// カーソル（キャレット）を先頭に持っていく
			this.$el.on('focus.bcTextField click.bcTextField', (): void => {
				if (this._equalPlaceholder()) {
					this._msCaretMoveToTop();
				}
			});
			// キーボードを押した瞬間に、プレースホルダーと値が同じだった場合
			// プレースホルダーの値を消して、空にする
			// TODO: 文字以外のキーを押すと一瞬値が消える（クリティカルでないため保留）
			$(document).on('keydown.bcTextField-' + this.id, (e: JQueryKeyEventObject): void => {
				if (this.hasFocus) {
					if (this._equalPlaceholder()) {
						this.$el.val('');
					}
				}
			});
		}

	}

	/**
	 * 要素の状態を更新する
	 *
	 * use: jQuery
	 *
	 * @version 0.9.0
	 * @since 0.4.0
	 *
	 */
	private _update (): void {

		const currentValue: string = this.$el.val() || '';
		const isEmpty: boolean = !currentValue;

		if (TextField.supportPlaceholder) {
			if (isEmpty) {
				this._setStateUninputted();
			} else {
				this._setStateInputted();
			}
		} else {
			if (this._equalPlaceholder()) {
				this._setStateUninputted();
			} else {
				if (isEmpty) {
					this._setStateUninputted();
					this._setPlaceholderValue();
				} else {
					this._setStateInputted();
				}
			}
		}

	}

	/**
	 * 入力されている状態を設定する
	 *
	 * use: jQuery
	 *
	 * @version 0.9.0
	 * @since 0.4.0
	 *
	 */
	private _setStateInputted (): void {
		this.isEmpty = false;
		BaserElement.removeClass(
			this.el,
			FormElement.classNameFormElementCommon,
			'',
			TextField.classNameStateUninput);
		BaserElement.removeClassFrom(
			this.$label,
			FormElement.classNameFormElementCommon,
			FormElement.classNameLabel,
			TextField.classNameStateUninput);
		BaserElement.removeClassFrom(
			this.$wrapper,
			FormElement.classNameWrapper,
			'',
			TextField.classNameStateUninput);
	}

	/**
	 * 入力されていない状態を設定する
	 *
	 * use: jQuery
	 *
	 * @version 0.9.0
	 * @since 0.4.0
	 *
	 */
	private _setStateUninputted (): void {
		this.isEmpty = true;
		BaserElement.addClass(
			this.el,
			FormElement.classNameFormElementCommon,
			'',
			TextField.classNameStateUninput);
		BaserElement.addClassTo(
			this.$label,
			FormElement.classNameFormElementCommon,
			FormElement.classNameLabel,
			TextField.classNameStateUninput);
		BaserElement.addClassTo(
			this.$wrapper,
			FormElement.classNameWrapper,
			'',
			TextField.classNameStateUninput);
	}

	/**
	 * プレースホルダーと値が同じかどうか
	 *
	 * use: jQuery
	 *
	 * @version 0.9.0
	 * @since 0.4.0
	 *
	 */
	private _equalPlaceholder (): boolean {
		const currentValue: string = this.$el.val() || '';
		return this.placeholder === currentValue;
	}

	/**
	 * プレースホルダーの値を設定する
	 *
	 * use: jQuery
	 *
	 * @version 0.4.0
	 * @since 0.4.0
	 *
	 */
	private _setPlaceholderValue (): void {
		this.$el.val(this.placeholder);
		this._msCaretMoveToTop();
	}

	/**
	 * 【IE用】カーソル（キャレット）を先頭に持っていく
	 *
	 * @version 0.9.0
	 * @since 0.4.0
	 *
	 */
	private _msCaretMoveToTop (): void {
		// TODO: MS用の型を調査して定義
		const input: any = this.el;
		const range: any = input.createTextRange();
		range.collapse();
		range.moveStart('character', 0);
		range.moveEnd('character', 0);
		range.select();
	}

}

export = TextField;

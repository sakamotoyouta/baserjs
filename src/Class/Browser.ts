import EventDispatcher = require('./EventDispatcher');
import Locational = require('./Locational');
import BrowserUserAgent = require('../Interface/BrowserUserAgent');

type LinkElement = HTMLAnchorElement | HTMLAreaElement;

/**
 * ブラウザの情報を管理するクラス
 *
 * TODO: テストを書く（テストフレームワークの選定から）
 *
 * @version 0.9.0
 * @since 0.0.2
 *
 */
class Browser extends EventDispatcher {

	/**
	 * ブラウザ
	 *
	 * @version 0.0.10
	 * @since 0.0.10
	 *
	 */
	public static browser: Browser = new Browser();

	/**
	 * デバイス・OS・ブラウザの情報
	 *
	 * @version 0.4.0
	 * @since 0.0.1
	 *
	 */
	public static spec: {
		isTouchable: boolean;
		ua: BrowserUserAgent;
	} = {
		isTouchable: 'ontouchstart' in window,
		ua: Browser.getUA(),
	};


	/**
	 * 参照するAPIのスキーム
	 *
	 * @version 0.9.1
	 * @since 0.9.1
	 *
	 */
	public static apiScheme: string = /https?:/i.test(location.protocol) ? '' : 'http:';

	/**
	 * リサイズイベントからリサイズエンドイベントまでのインターバル
	 *
	 * @version 0.0.2
	 * @since 0.0.2
	 *
	 */
	public resizeEndInterval: number = 100;

	/**
	 * スクロールイベントからスクロールエンドイベントまでのインターバル
	 *
	 * @version 0.0.2
	 * @since 0.0.2
	 *
	 */
	public scrollEndInterval: number = 100;

	/**
	 * 現在リサイズ中かどうか
	 *
	 * @version 0.0.2
	 * @since 0.0.2
	 *
	 */
	public isResize: boolean = false;

	/**
	 * 現在スクロール中かどうか
	 *
	 * @version 0.0.2
	 * @since 0.0.2
	 *
	 */
	public isScroll: boolean = false;

	/**
	 * コンストラクタ
	 *
	 * use jQuery
	 *
	 * @version 0.9.0
	 * @since 0.0.2
	 *
	 */
	constructor () {

		super();

		const $window: JQuery = $(window);

		// リサイズイベント
		let resizeEndTimer: number;
		$window.on('resize', (e: JQueryEventObject): void => {
			if (!this.isResize) {
				this.trigger('resizestart');
			}
			this.isResize = true;
			this.trigger('resize');
			window.clearTimeout(resizeEndTimer);
			resizeEndTimer = window.setTimeout(
				(): void => {
					this.isResize = false;
					this.trigger('resize');
					this.trigger('resizeend');
				},
				this.resizeEndInterval
			);
		});

		// スクロールイベント
		let scrollEndTimer: number;
		$window.on('scroll', (e: JQueryEventObject): void => {
			if (!this.isScroll) {
				this.trigger('scrollstart');
			}
			this.isScroll = true;
			this.trigger('scroll');
			window.clearTimeout(scrollEndTimer);
			scrollEndTimer = window.setTimeout(
				(): void => {
					this.isScroll = false;
					this.trigger('scroll');
					this.trigger('scrollend');
				},
				this.resizeEndInterval
			);
		});
	}

	/**
	 * ページ遷移する
	 *
	 * @version 0.9.0
	 * @since 0.1.0
	 *
	 */
	public static jumpTo (path: string | Locational, isBlank: boolean = false): void {
		let href: string;
		if (typeof path === 'string') {
			href = path;
		} else {
			href = path.href;
		}
		if (!isBlank) {
			window.location.href = href;
		} else {
			window.open(href, null);
		}
	}

	/**
	 * ユーザーエージェント情報を取得する
	 *
	 * @version 0.9.0
	 * @since 0.0.1
	 *
	 */
	public static getUA (): BrowserUserAgent {
		const ua: string = navigator.userAgent;
		const bua: BrowserUserAgent = {
			iOS: false,
			android: /android/i.test(ua),
			iPad: /ipad/i.test(ua),
			iPhone: /iphone/i.test(ua),
			iPod: /ipod/i.test(ua),
			safari: /safari/i.test(ua),
			chrome: /crios|chrome/i.test(ua),
			edge: /edge/i.test(ua),
			ie: /msie/.test(ua),
		};
		bua.iOS = bua.iPad || bua.iPhone || bua.iPod || false;
		if (bua.chrome) {
			bua.safari = false;
		}
		if (bua.edge) {
			bua.safari = false;
			bua.chrome = false;
		}
		return bua;
	}

	/**
	 * 現在のURLのパラメータをリンク先へ引き継がせる
	 *
	 * use: jQuery
	 *
	 * @version 0.9.0
	 * @since 0.7.0
	 *
	 */
	public static inheritParams (targetParam: string): void {
		const $target: JQuery = $('a, area').filter('[href]');
		const thisLocation: Locational = new Locational(location);
		if (!(targetParam in thisLocation.params)) {
			return;
		}
		const query: string = targetParam;
		const value: string | string[] = thisLocation.params[targetParam];
		$target.each( (i: number, elem: Element): any => {
			const targetElem: LinkElement = <LinkElement> elem;
			const loc: Locational = new Locational(targetElem);
			if (thisLocation.host === loc.host) {
				loc.addParam(query, value);
				targetElem.href = loc.href;
			}
		});
	}

}

export = Browser;

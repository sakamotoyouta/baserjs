/**
 * YouTubeクラスのコンストラクタのオプション
 *
 * @version 0.0.16
 * @since 0.0.16
 *
 */
interface YouTubeOption {

	/**
	 * YouTubeの動画ID
	 *
	 * @since 0.8.0
	 *
	 */
	id?: string;

	/**
	 * 関連動画を再生後に表示させるかどうか
	 *
	 * @since 0.0.16
	 *
	 */
	rel?: boolean;

	/**
	 * 自動再生させるかどうか
	 *
	 * @since 0.0.16
	 *
	 */
	autoplay?: boolean;

	/**
	 * ウィンドウがアクティブでなくなった時に再生を停止するかどうか
	 *
	 * @since 0.0.16
	 *
	 */
	stopOnInactive?: boolean;

	/**
	 * コントロールを表示させるかどうか
	 *
	 * @since 0.0.16
	 *
	 */
	controls?: boolean;

	/**
	 * ループ再生するかどうか
	 *
	 * @since 0.0.16
	 *
	 */
	loop?: boolean;

	/**
	 * 動画情報を表示させるかどうか
	 *
	 * @since 0.0.16
	 *
	 */
	showinfo?: boolean;

	/**
	 * 初期状態でミュートするかどうか
	 *
	 * @since 0.5.0
	 *
	 */
	mute?: boolean;

	/**
	 * 動画の幅
	 *
	 * @since 0.8.0
	 *
	 */
	width?: number;

	/**
	 * 動画の高さ
	 *
	 * @since 0.8.0
	 *
	 */
	height?: number;

	/**
	 * 再生リストの中から最初に再生する動画の番号
	 *
	 * @since 0.8.0
	 *
	 */
	index?: number;

	/**
	 * サムネイル画像のパス
	 *
	 * @version 0.9.1
	 * @since 0.9.1
	 */
	poster?: string;

	/**
	 * サムネイル画像が高画質かどうか
	 *
	 * @version 0.10.0
	 * @since 0.9.1
	 */
	posterHighQuality?: boolean;

	/**
	 * 再生リストの中から最初に再生する動画の再生位置
	 *
	 * 単位: 秒
	 *
	 * @since 0.9.1
	 *
	 */
	startSeconds?: number;

	/**
	 * 動画の推奨再生画質を指定
	 *
	 * - 画質レベル small: プレーヤーの高さが 240 ピクセル、サイズが 320x240 ピクセル（アスペクト比 4:3）以上。
	 * - 画質レベル medium: プレーヤーの高さが 360 ピクセル、サイズが 640x360 ピクセル（アスペクト比 16:9）または 480x360 ピクセル（アスペクト比 4:3）。
	 * - 画質レベル large: プレーヤーの高さが 480 ピクセル、サイズが 853x480 ピクセル（アスペクト比 16:9）または 640x480 ピクセル（アスペクト比 4:3）。
	 * - 画質レベル hd720: プレーヤーの高さが 720 ピクセル、サイズが 1280x720 ピクセル（アスペクト比 16:9）または 960x720 ピクセル（アスペクト比 4:3）。
	 * - 画質レベル hd1080: プレーヤーの高さが 1080 ピクセル、サイズが 1920x1080 ピクセル（アスペクト比 16:9）または 1440x1080 ピクセル（アスペクト比 4:3）。
	 * - 画質レベル highres: プレーヤーの高さが 1080 ピクセル以上、つまりプレーヤーのアスペクト比が 1920x1080 ピクセル以上。
	 * - 画質レベル default: YouTube が適切な再生画質を選択します。この設定は、画質レベルをデフォルトの状態に戻します。それまでに cueVideoById、loadVideoById または setPlaybackQuality の各関数で行った再生画質の設定は無効になります。
	 *
	 * @since 0.9.1
	 *
	 */
	suggestedQuality?: string;

	/**
	 * シャッフル再生するかどうか
	 *
	 * @since 0.10.0
	 *
	 */
	shuffle?: boolean;

	/**
	 * 自動再生でないとき、且つサムネイルの指定があるときに仮埋め込みを実行するかどうか
	 *
	 * @since 0.10.3
	 */
	preEmbed?: boolean;

}

export = YouTubeOption;

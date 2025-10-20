import type { Crop, UserPreferences } from '@types';

/**
 * クロップ設定管理サービス
 *
 * ## 責務
 * - ユーザーのクロップ設定（サイズ、アスペクト比）の適用
 * - 画像サイズに基づく設定の調整
 * - デフォルト値の提供
 *
 * ## Single Responsibility Principle
 * このクラスはクロップ設定の管理のみに責任を持ちます。
 * UI状態管理や実際のクロップ処理は他のクラスが担当します。
 *
 * ## 使用例
 * ```typescript
 * const manager = new CropPreferencesManager();
 * const crop = manager.applyCropPreferences(
 *   imageWidth,
 *   imageHeight,
 *   userPreferences
 * );
 * ```
 */
export class CropPreferencesManager {
  /**
   * デフォルトのクロップサイズ（ピクセル）
   */
  private readonly DEFAULT_CROP_SIZE = 100;

  /**
   * アスペクト比適用時のデフォルト幅の割合
   */
  private readonly DEFAULT_WIDTH_RATIO = 0.5;

  /**
   * ユーザー設定を新しい画像に適用する
   *
   * @param imageWidth 画像の幅
   * @param imageHeight 画像の高さ
   * @param preferences ユーザー設定
   * @returns 適用されたクロップ設定
   *
   * ## 処理フロー
   * 1. サイズ設定がある場合 → サイズを適用し、必要に応じてアスペクト比で調整
   * 2. アスペクト比のみの場合 → デフォルト幅でアスペクト比を適用
   * 3. 設定なし → デフォルト値を返す
   */
  applyCropPreferences(
    imageWidth: number,
    imageHeight: number,
    preferences: UserPreferences
  ): Crop {
    // サイズ設定がある場合
    if (preferences.manualSize) {
      return this.applyManualSize(imageWidth, imageHeight, preferences);
    }

    // サイズ設定がなくアスペクト比のみ設定されている場合
    if (preferences.manualAspectRatio) {
      return this.applyAspectRatioOnly(imageWidth, preferences.manualAspectRatio);
    }

    // 設定なし：デフォルト値
    return this.getDefaultCrop();
  }

  /**
   * 手動サイズ設定を適用
   *
   * @param imageWidth 画像の幅
   * @param imageHeight 画像の高さ
   * @param preferences ユーザー設定
   * @returns 適用されたクロップ設定
   */
  private applyManualSize(
    imageWidth: number,
    imageHeight: number,
    preferences: UserPreferences
  ): Crop {
    if (!preferences.manualSize) {
      return this.getDefaultCrop();
    }

    let { width, height, unit } = preferences.manualSize;

    // ピクセル単位の場合、画像サイズより大きければ画像に合わせる
    if (unit === 'px') {
      width = Math.min(width, imageWidth);
      height = Math.min(height, imageHeight);
    }

    // アスペクト比設定もある場合は調整
    if (preferences.manualAspectRatio) {
      const adjusted = this.adjustSizeWithAspectRatio(
        width,
        imageHeight,
        preferences.manualAspectRatio
      );
      width = adjusted.width;
      height = adjusted.height;
    }

    return { x: 0, y: 0, width, height, unit };
  }

  /**
   * アスペクト比のみを適用
   *
   * @param imageWidth 画像の幅
   * @param aspectRatio アスペクト比
   * @returns 適用されたクロップ設定
   */
  private applyAspectRatioOnly(imageWidth: number, aspectRatio: number): Crop {
    // デフォルトの50%幅でアスペクト比を適用
    const width = imageWidth * this.DEFAULT_WIDTH_RATIO;
    const height = width / aspectRatio;

    return { x: 0, y: 0, width, height, unit: 'px' };
  }

  /**
   * サイズをアスペクト比に合わせて調整
   *
   * @param width 幅
   * @param imageHeight 画像の高さ
   * @param aspectRatio アスペクト比
   * @returns 調整されたサイズ
   */
  private adjustSizeWithAspectRatio(
    width: number,
    imageHeight: number,
    aspectRatio: number
  ): { width: number; height: number } {
    // アスペクト比を維持しつつサイズ調整
    const newHeight = width / aspectRatio;

    if (newHeight <= imageHeight) {
      return { width, height: newHeight };
    }

    // 高さが画像を超える場合は高さから逆算
    return {
      width: imageHeight * aspectRatio,
      height: imageHeight,
    };
  }

  /**
   * デフォルトのクロップ設定を取得
   *
   * @returns デフォルトクロップ設定
   */
  private getDefaultCrop(): Crop {
    return {
      unit: 'px',
      x: 0,
      y: 0,
      width: this.DEFAULT_CROP_SIZE,
      height: this.DEFAULT_CROP_SIZE,
    };
  }

  /**
   * クロップ設定から手動サイズ設定を抽出
   *
   * @param crop クロップ設定
   * @returns 手動サイズ設定
   */
  extractManualSize(crop: Crop): { width: number; height: number; unit: 'px' | '%' } {
    return {
      width: crop.width,
      height: crop.height,
      unit: crop.unit,
    };
  }

  /**
   * 設定を検証
   *
   * @param preferences ユーザー設定
   * @returns 検証結果
   */
  validatePreferences(preferences: UserPreferences): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (preferences.manualSize) {
      if (preferences.manualSize.width <= 0) {
        errors.push('幅は0より大きい値である必要があります');
      }
      if (preferences.manualSize.height <= 0) {
        errors.push('高さは0より大きい値である必要があります');
      }
    }

    if (preferences.manualAspectRatio !== undefined && preferences.manualAspectRatio !== null) {
      if (preferences.manualAspectRatio <= 0) {
        errors.push('アスペクト比は0より大きい値である必要があります');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

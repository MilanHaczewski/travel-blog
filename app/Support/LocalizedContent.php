<?php

namespace App\Support;

class LocalizedContent
{
    public const LANGUAGES = ['nl', 'en', 'es'];

    public static function fromPayload(array $data, string $field): array
    {
        $translations = $data["{$field}_translations"] ?? [];

        if (! is_array($translations)) {
            $translations = [];
        }

        $fallback = isset($data[$field]) && is_string($data[$field])
            ? $data[$field]
            : null;

        return self::normalize($translations, $fallback);
    }

    public static function formValues(?array $translations, ?string $fallback = null): array
    {
        $translations = self::normalize($translations, $fallback);

        return collect(self::LANGUAGES)
            ->mapWithKeys(fn (string $language) => [$language => $translations[$language] ?? ''])
            ->all();
    }

    public static function primary(array $translations, ?string $fallback = null): ?string
    {
        foreach (self::LANGUAGES as $language) {
            $value = $translations[$language] ?? null;

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        if ($fallback === null || trim($fallback) === '') {
            return null;
        }

        return trim($fallback);
    }

    public static function nullable(array $translations): ?array
    {
        return $translations === [] ? null : $translations;
    }

    public static function normalize(?array $translations, ?string $fallback = null): array
    {
        $normalized = [];

        foreach (self::LANGUAGES as $language) {
            $value = $translations[$language] ?? null;

            if (! is_string($value)) {
                continue;
            }

            $value = trim($value);

            if ($value !== '') {
                $normalized[$language] = $value;
            }
        }

        if (! isset($normalized['nl']) && $fallback !== null && trim($fallback) !== '') {
            $normalized['nl'] = trim($fallback);
        }

        return $normalized;
    }
}

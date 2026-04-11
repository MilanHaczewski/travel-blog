import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState, type CSSProperties } from 'react';

type FeaturedPost = {
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
};

export type MapLocation = {
    id: number;
    title: string;
    slug: string;
    country: string;
    continent: string | null;
    city: string | null;
    cover_image: string | null;
    latitude: number;
    longitude: number;
    post_count: number;
    featured_post: FeaturedPost | null;
};

type Bounds = {
    north: number;
    south: number;
    west: number;
    east: number;
};

type ViewBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type FitMetrics = {
    scale: number;
    offsetX: number;
    offsetY: number;
};

type PositionedLocation = MapLocation & {
    worldX: number;
    worldY: number;
    x: number;
    y: number;
};

type Props = {
    locations: MapLocation[];
    focusRegion?: string;
};

const worldBounds: Bounds = {
    north: 90,
    south: -90,
    west: -180,
    east: 180,
};

const overviewBounds: Bounds = {
    north: 82,
    south: -58,
    west: -180,
    east: 180,
};

const regionBounds: Record<string, Bounds> = {
    Alles: worldBounds,
    Europa: {
        north: 72,
        south: 30,
        west: -15,
        east: 42,
    },
    'Zuid-Amerika': {
        north: 15,
        south: -57,
        west: -85,
        east: -33,
    },
    'Noord-Amerika': {
        north: 73,
        south: 5,
        west: -170,
        east: -50,
    },
    Azie: {
        north: 78,
        south: -10,
        west: 25,
        east: 150,
    },
    Afrika: {
        north: 38,
        south: -36,
        west: -20,
        east: 56,
    },
    Oceanie: {
        north: 8,
        south: -50,
        west: 108,
        east: 180,
    },
};

const regionPadding: Record<string, { left: number; right: number; top: number; bottom: number }> = {
    Alles: { left: 0, right: 0, top: 0, bottom: 0 },
    Europa: { left: 4.5, right: 4.5, top: 5.5, bottom: 5.5 },
    'Zuid-Amerika': { left: 4.25, right: 4.25, top: 5.25, bottom: 5.25 },
    'Noord-Amerika': { left: 5.25, right: 4.75, top: 6.5, bottom: 5.5 },
    Azie: { left: 4.75, right: 5.5, top: 6.25, bottom: 5.5 },
    Afrika: { left: 4.5, right: 4.5, top: 6.25, bottom: 5.5 },
    Oceanie: { left: 6, right: 4.75, top: 7, bottom: 5.5 },
};

const regionMinimumSize: Record<string, { width: number; height: number }> = {
    Alles: { width: 100, height: 100 },
    Europa: { width: 22, height: 18 },
    'Zuid-Amerika': { width: 18, height: 24 },
    'Noord-Amerika': { width: 24, height: 20 },
    Azie: { width: 26, height: 20 },
    Afrika: { width: 20, height: 22 },
    Oceanie: { width: 22, height: 20 },
};

const collisionOffsets = [
    { x: 0, y: 0 },
    { x: 2.1, y: -2.3 },
    { x: -2.3, y: 2.1 },
    { x: 2.3, y: 2.1 },
    { x: -2.1, y: -2.3 },
];

const fallbackPreview =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function projectToWorld(latitude: number, longitude: number) {
    const x = ((longitude - worldBounds.west) / (worldBounds.east - worldBounds.west)) * 100;
    const y = ((worldBounds.north - latitude) / (worldBounds.north - worldBounds.south)) * 100;

    return {
        x: clamp(x, 0, 100),
        y: clamp(y, 0, 100),
    };
}

function normalizeViewBox(viewBox: ViewBox) {
    const width = clamp(viewBox.width, 12, 100);
    const height = clamp(viewBox.height, 14, 100);
    const x = clamp(viewBox.x, 0, 100 - width);
    const y = clamp(viewBox.y, 0, 100 - height);

    return { x, y, width, height };
}

function boundsToViewBox(bounds: Bounds, padding: { left: number; right: number; top: number; bottom: number }) {
    const northWest = projectToWorld(bounds.north, bounds.west);
    const southEast = projectToWorld(bounds.south, bounds.east);

    return normalizeViewBox({
        x: northWest.x - padding.left,
        y: northWest.y - padding.top,
        width: southEast.x - northWest.x + padding.left + padding.right,
        height: southEast.y - northWest.y + padding.top + padding.bottom,
    });
}

function viewBoxFromLocations(focusRegion: string, locations: MapLocation[]) {
    if (focusRegion === 'Alles' || locations.length === 0) {
        return null;
    }

    const fallbackBounds = regionBounds[focusRegion] ?? overviewBounds;

    if (!fallbackBounds) {
        return null;
    }

    const padding = regionPadding[focusRegion] ?? regionPadding.Alles;
    const minimumSize = regionMinimumSize[focusRegion] ?? regionMinimumSize.Alles;
    const fallbackViewBox = boundsToViewBox(fallbackBounds, padding);
    const worldPoints = locations.map((location) => projectToWorld(location.latitude, location.longitude));
    const minX = Math.min(...worldPoints.map((point) => point.x));
    const maxX = Math.max(...worldPoints.map((point) => point.x));
    const minY = Math.min(...worldPoints.map((point) => point.y));
    const maxY = Math.max(...worldPoints.map((point) => point.y));
    const width = clamp(Math.max(maxX - minX + padding.left + padding.right, minimumSize.width), 12, fallbackViewBox.width);
    const height = clamp(Math.max(maxY - minY + padding.top + padding.bottom, minimumSize.height), 14, fallbackViewBox.height);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const x = clamp(centerX - width / 2, fallbackViewBox.x, Math.max(fallbackViewBox.x, fallbackViewBox.x + fallbackViewBox.width - width));
    const y = clamp(centerY - height / 2, fallbackViewBox.y, Math.max(fallbackViewBox.y, fallbackViewBox.y + fallbackViewBox.height - height));

    return normalizeViewBox({
        x,
        y,
        width,
        height,
    });
}

function viewBoxForRegion(focusRegion: string, locations: MapLocation[]) {
    if (focusRegion === 'Alles') {
        return boundsToViewBox(worldBounds, regionPadding.Alles);
    }

    const dynamicViewBox = viewBoxFromLocations(focusRegion, locations);

    if (dynamicViewBox) {
        return dynamicViewBox;
    }

    const fallbackBounds = regionBounds[focusRegion] ?? overviewBounds;
    const padding = regionPadding[focusRegion] ?? regionPadding.Alles;

    return boundsToViewBox(fallbackBounds, padding);
}

function fitMetricsForViewBox(viewBox: ViewBox): FitMetrics {
    const scale = Math.min(100 / viewBox.width, 100 / viewBox.height);
    const offsetX = (100 - viewBox.width * scale) / 2;
    const offsetY = (100 - viewBox.height * scale) / 2;

    return { scale, offsetX, offsetY };
}

function projectToViewport(worldX: number, worldY: number, viewBox: ViewBox, metrics: FitMetrics) {
    return {
        x: clamp((worldX - viewBox.x) * metrics.scale + metrics.offsetX, 4, 96),
        y: clamp((worldY - viewBox.y) * metrics.scale + metrics.offsetY, 5, 95),
    };
}

function spreadLocations(locations: MapLocation[], viewBox: ViewBox, metrics: FitMetrics): PositionedLocation[] {
    const placed: PositionedLocation[] = [];

    return locations.map((location) => {
        const worldPoint = projectToWorld(location.latitude, location.longitude);
        const projected = projectToViewport(worldPoint.x, worldPoint.y, viewBox, metrics);
        const collisions = placed.filter((placedLocation) => Math.abs(placedLocation.x - projected.x) < 4 && Math.abs(placedLocation.y - projected.y) < 4.5).length;
        const offset = collisionOffsets[collisions % collisionOffsets.length];

        const positionedLocation = {
            ...location,
            worldX: worldPoint.x,
            worldY: worldPoint.y,
            x: clamp(projected.x + offset.x, 4, 96),
            y: clamp(projected.y + offset.y, 5, 95),
        };

        placed.push(positionedLocation);

        return positionedLocation;
    });
}

function bubblePosition(location: PositionedLocation) {
    const horizontal = location.x < 18 ? 'left-0' : location.x > 82 ? 'right-0' : 'left-1/2 -translate-x-1/2';
    const vertical = location.y < 22 ? 'top-10' : 'bottom-10';

    return `${horizontal} ${vertical}`;
}

function TravelMap({ locations, focusRegion = 'Alles' }: Props) {
    const viewBox = useMemo(() => viewBoxForRegion(focusRegion, locations), [focusRegion, locations]);
    const fitMetrics = useMemo(() => fitMetricsForViewBox(viewBox), [viewBox]);
    const positionedLocations = useMemo(() => spreadLocations(locations, viewBox, fitMetrics), [locations, viewBox, fitMetrics]);
    const routePoints = useMemo(
        () =>
            [...positionedLocations]
                .sort((left, right) => left.worldX - right.worldX)
                .map((location) => `${location.worldX},${location.worldY}`)
                .join(' '),
        [positionedLocations],
    );
    const layerTransform = useMemo(() => {
        const translateX = fitMetrics.offsetX - viewBox.x * fitMetrics.scale;
        const translateY = fitMetrics.offsetY - viewBox.y * fitMetrics.scale;

        return `translate(${translateX}%, ${translateY}%) scale(${fitMetrics.scale})`;
    }, [fitMetrics, viewBox]);
    const highlightClipPath = useMemo(() => {
        if (focusRegion === 'Alles') {
            return null;
        }

        const bounds = regionBounds[focusRegion];

        if (!bounds) {
            return null;
        }

        const northWest = projectToWorld(bounds.north, bounds.west);
        const southEast = projectToWorld(bounds.south, bounds.east);

        return `inset(${northWest.y}% ${100 - southEast.x}% ${100 - southEast.y}% ${northWest.x}%)`;
    }, [focusRegion]);
    const [activeId, setActiveId] = useState<number | null>(null);

    useEffect(() => {
        if (activeId !== null && !positionedLocations.some((location) => location.id === activeId)) {
            setActiveId(null);
        }
    }, [activeId, positionedLocations]);

    if (positionedLocations.length === 0) {
        return (
            <div className="rounded-[2rem] border border-dashed border-[#cb5b4c]/20 bg-white/70 p-10 text-slate-500">
                Zodra een bestemming coordinaten en een gepubliceerd verhaal heeft, verschijnt hij hier als pin op de kaart.
            </div>
        );
    }

    return (
        <div
            className="relative aspect-[2/1] min-h-[340px] w-full overflow-hidden rounded-[2.5rem] border border-white/80 bg-[#9cddd8] shadow-[0_35px_90px_rgba(89,151,148,0.2)] md:min-h-[480px] xl:min-h-[620px]"
            onMouseLeave={() => setActiveId(null)}
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,248,239,0.86),transparent_23%),radial-gradient(circle_at_78%_76%,rgba(255,214,107,0.23),transparent_24%),linear-gradient(180deg,rgba(244,252,251,0.68)_0%,rgba(156,221,216,0.2)_24%,rgba(104,191,185,0.16)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(255,255,255,0.06)_56%,rgba(22,101,95,0.08)_100%)]" />

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_26%,rgba(255,214,107,0.16),transparent_18%),radial-gradient(circle_at_72%_68%,rgba(255,255,255,0.16),transparent_24%),linear-gradient(180deg,rgba(239,251,250,0.3)_0%,rgba(168,221,218,0.1)_100%)]" />

                <div
                    className="absolute inset-0 origin-top-left will-change-transform transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ transform: layerTransform }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(180deg, rgba(124, 190, 138, 0.96) 0%, rgba(73, 143, 105, 0.98) 100%)',
                            WebkitMaskImage: "url('/blank-map-equirectangular.svg')",
                            maskImage: "url('/blank-map-equirectangular.svg')",
                            WebkitMaskRepeat: 'no-repeat',
                            maskRepeat: 'no-repeat',
                            WebkitMaskSize: '100% 100%',
                            maskSize: '100% 100%',
                            filter: 'drop-shadow(0 0 16px rgba(255, 226, 153, 0.18))',
                        }}
                    />

                    {highlightClipPath ? (
                        <div
                            className="absolute inset-0"
                            style={{
                                background: 'linear-gradient(180deg, rgba(255, 224, 134, 0.98) 0%, rgba(223, 176, 78, 0.98) 100%)',
                                WebkitMaskImage: "url('/blank-map-equirectangular.svg')",
                                maskImage: "url('/blank-map-equirectangular.svg')",
                                WebkitMaskRepeat: 'no-repeat',
                                maskRepeat: 'no-repeat',
                                WebkitMaskSize: '100% 100%',
                                maskSize: '100% 100%',
                                WebkitClipPath: highlightClipPath,
                                clipPath: highlightClipPath,
                            }}
                        />
                    ) : null}

                    <img
                        src="/blank-map-equirectangular.svg"
                        alt=""
                        aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-[0.18]"
                            style={{
                            filter: 'blur(9px) sepia(0.18) saturate(0.86) hue-rotate(6deg) brightness(1.03)',
                        }}
                    />

                    <img
                        src="/blank-map-equirectangular.svg"
                        alt=""
                        aria-hidden="true"
                            className="pointer-events-none absolute inset-0 h-full w-full select-none opacity-[0.28]"
                            style={{
                                mixBlendMode: 'multiply',
                            filter: 'sepia(0.22) saturate(0.72) hue-rotate(10deg) brightness(0.86)',
                        }}
                    />

                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                        <defs>
                            <pattern id="gridPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                                <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.15" />
                            </pattern>
                        </defs>

                        <rect x="0" y="0" width="100" height="100" fill="url(#gridPattern)" opacity="0.55" />
                        <polyline
                            points={routePoints}
                            fill="none"
                            stroke="rgba(255, 214, 107, 0.62)"
                            strokeDasharray="1.4 2.4"
                            strokeLinecap="round"
                            strokeWidth="0.65"
                        />
                    </svg>
                </div>

                {positionedLocations.map((location) => {
                    const isActive = activeId === location.id;
                    const previewImage = location.featured_post?.cover_image ?? location.cover_image ?? fallbackPreview;
                    const primaryHref = location.featured_post ? `/posts/${location.featured_post.slug}` : `/destinations/${location.slug}`;
                    const pinStyle: CSSProperties = {
                        left: `${location.x}%`,
                        top: `${location.y}%`,
                    };

                    return (
                        <div
                            key={location.id}
                            style={pinStyle}
                            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
                        >
                            <button
                                type="button"
                                onMouseEnter={() => setActiveId(location.id)}
                                onFocus={() => setActiveId(location.id)}
                                onClick={() => setActiveId(location.id)}
                                className="relative flex h-8 w-8 items-center justify-center"
                                aria-label={`Bekijk verhalen over ${location.title}`}
                            >
                                <span className={`absolute h-8 w-8 rounded-full bg-[#ffd66b]/35 ${isActive ? 'animate-ping' : ''}`} />
                                <span
                                    className={`relative flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-white shadow-lg transition ${
                                        isActive ? 'scale-110 bg-[#cb5b4c]' : 'bg-[#0f766e]'
                                    }`}
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                </span>
                            </button>

                            {isActive ? (
                                <div
                                        className={`absolute z-30 w-64 overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/96 shadow-[0_18px_45px_rgba(15,23,42,0.18)] backdrop-blur-sm ${bubblePosition(location)}`}
                                    >
                                    <img
                                        src={previewImage}
                                        alt={location.featured_post?.title ?? location.title}
                                        className="h-28 w-full object-cover"
                                    />
                                    <div className="p-4">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#cb5b4c]">
                                            {location.continent ? `${location.continent} / ` : ''}
                                            {location.country} / {location.post_count} {location.post_count === 1 ? 'verhaal' : 'verhalen'}
                                        </p>
                                        <Link href={primaryHref} className="mt-2 block text-lg font-black text-slate-900 transition hover:text-[#cb5b4c]">
                                            {location.title}
                                        </Link>
                                        <p className="mt-1 text-sm font-semibold text-slate-700">
                                            {location.featured_post?.title ?? 'Nieuw verhaal in voorbereiding'}
                                        </p>
                                        {location.featured_post?.excerpt ? (
                                            <p className="mt-2 text-sm leading-6 text-slate-600">{location.featured_post.excerpt}</p>
                                        ) : (
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                Deze pin brengt jullie bezoekers meteen naar het verhaal achter deze plek.
                                            </p>
                                        )}
                                        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                                            <Link href={primaryHref} className="font-semibold text-[#cb5b4c]">
                                                Lees post
                                            </Link>
                                            <Link href={`/destinations/${location.slug}`} className="font-semibold text-slate-500">
                                                Alle verhalen
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>

            <div className="absolute left-5 top-5 z-10 max-w-sm rounded-[1.8rem] border border-white/70 bg-[#fff7ef]/84 px-5 py-4 text-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-md">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#cb5b4c]/80">Story map</p>
                <h3 className="mt-2 text-2xl font-black">
                    {focusRegion === 'Alles' ? 'Van Colombia tot Europa' : `Focus op ${focusRegion}`}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700/85">
                    {focusRegion === 'Alles'
                        ? 'Hover op een pin en open meteen het verhaal achter die plek. De kaart blijft breed, maar heeft nu wel weer die rustige uitleg terug.'
                        : 'De kaart zoomt nu op jullie pins binnen dit continent en houdt tegelijk de warme contextbalk zichtbaar.'}
                </p>
            </div>
        </div>
    );
}

export default TravelMap;

import { DotType } from "../types";
type GetNeighbor = (x: number, y: number) => boolean;
type DrawArgs = {
    x: number;
    y: number;
    size: number;
    context: CanvasRenderingContext2D;
    getNeighbor: GetNeighbor;
};
type BasicFigureDrawArgs = {
    x: number;
    y: number;
    size: number;
    context: CanvasRenderingContext2D;
    rotation: number;
};
type RotateFigureArgs = {
    x: number;
    y: number;
    size: number;
    context: CanvasRenderingContext2D;
    rotation: number;
    draw: () => void;
};
export default class QRDot {
    _context: CanvasRenderingContext2D;
    _type: DotType;
    constructor({ context, type }: {
        context: CanvasRenderingContext2D;
        type: DotType;
    });
    draw(x: number, y: number, size: number, getNeighbor: GetNeighbor): void;
    _rotateFigure({ x, y, size, context, rotation, draw }: RotateFigureArgs): void;
    _basicDot(args: BasicFigureDrawArgs): void;
    _basicSquare(args: BasicFigureDrawArgs): void;
    _basicSideRounded(args: BasicFigureDrawArgs): void;
    _basicCornerRounded(args: BasicFigureDrawArgs): void;
    _basicCornerExtraRounded(args: BasicFigureDrawArgs): void;
    _basicCornersRounded(args: BasicFigureDrawArgs): void;
    _basicCornersExtraRounded(args: BasicFigureDrawArgs): void;
    _drawDot({ x, y, size, context }: DrawArgs): void;
    _drawSquare({ x, y, size, context }: DrawArgs): void;
    _drawRounded({ x, y, size, context, getNeighbor }: DrawArgs): void;
    _drawExtraRounded({ x, y, size, context, getNeighbor }: DrawArgs): void;
    _drawClassy({ x, y, size, context, getNeighbor }: DrawArgs): void;
    _drawClassyRounded({ x, y, size, context, getNeighbor }: DrawArgs): void;
}
export {};

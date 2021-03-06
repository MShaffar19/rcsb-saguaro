import {RcsbCoreDisplay} from "./RcsbCoreDisplay";
import {BaseType, Selection} from "d3-selection";
import {RcsbDisplayInterface} from "./RcsbDisplayInterface";
import {MovePinInterface, PlotPinInterface, RcsbD3PinManager} from "../RcsbD3/RcsbD3DisplayManager/RcsbD3PinManager";
import {scaleLinear, ScaleLinear} from "d3-scale";
import {RcsbFvTrackDataElementInterface} from "../../RcsbDataManager/RcsbDataManager";
import {RcsbD3Constants} from "../RcsbD3/RcsbD3Constants";

export class RcsbPinDisplay extends RcsbCoreDisplay implements RcsbDisplayInterface {

    private yScale: ScaleLinear<number,number> = scaleLinear();
    private radius: number = 5;
    private labelShift: number = 10;
    private _yDomain: [number, number];
    private definedScale: boolean = false;

    private rcsbD3PinManager: RcsbD3PinManager =  new RcsbD3PinManager();

    yDomain(domain: [number,number]):void {
        this._yDomain = domain;
    }

    private setScale(): void{
        if(typeof this._height === "number" && this._yDomain.length == 2 && typeof this._yDomain[0] === "number" && typeof this._yDomain[1] === "number") {
            this.yScale
                .domain(this._yDomain)
                .range([this.radius, this._height - this.radius]);
            this.definedScale = true;
        }else{
            throw "FATAL ERROR: d3 scale unknown format";
        }
    }

    enter(e: Selection<SVGGElement, RcsbFvTrackDataElementInterface, BaseType, undefined>){
        e.append<SVGLineElement>(RcsbD3Constants.LINE);
        e.append<SVGCircleElement>(RcsbD3Constants.CIRCLE);
        e.append<SVGTextElement>(RcsbD3Constants.TEXT);
    }

    plot(elements:Selection<SVGGElement,RcsbFvTrackDataElementInterface,BaseType,undefined>): void{
        super.plot(elements);
        if(!this.definedScale)
            this.setScale();

        const config: PlotPinInterface = {
            elements: elements,
            radius: this.radius,
            labelShift: this.labelShift,
            xScale: this.xScale,
            yScale: this.yScale,
            height: this._height,
            color: this._displayColor as string
        };
        this.rcsbD3PinManager.plot(config);
    }

    move(): void{
        const config: MovePinInterface = {
            xScale: this.xScale,
            labelShift: this.labelShift,
            yScale: this.yScale,
            height: this._height,
        };
        this.rcsbD3PinManager.move(config);
    }
}
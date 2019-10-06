import {Component, OnInit} from '@angular/core';
import {from, of, Subscription} from 'rxjs';
import {concatMap, delay, map, skip} from 'rxjs/operators';
import {Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';

const MIN_INTERVAL = 150;
const MAX_INTERVAL = 400;

interface FlowState {
  currentWord: string;
  currentIndex: number;
  currentSpeed: number;
  sentence?: string;
  state: Status;
}

function initialFlowState(): FlowState {
  return {
    currentIndex: 0,
    currentSpeed: MIN_INTERVAL,
    currentWord: '',
    state: Status.NONE
  };
}

enum Status {
  NONE, PLAY, PAUSE, FINISHED
}


@Component({
  selector: 'app-flow-player',
  templateUrl: './flow-player.component.html',
  styleUrls: ['./flow-player.component.css']
})
export class FlowPlayerComponent implements OnInit {
  flowState: FlowState;
  subscription: Subscription;

  constructor(private router: Router) {
    this.flowState = initialFlowState();
    this.flowState.sentence = localStorage.getItem('data');
    console.log(localStorage.getItem('data'));
  }

  ngOnInit(): void {
  }

  determineSpeed(str: string): number {
    return this.flowState.currentSpeed + (!this.endsWithSymbols(str) ? 0 : 30) * 10 + str.length * 20;
  }

  endsWithSymbols(str: string): boolean {
    const lastLetter = str.slice(-1);
    return str.length > 1 && ['?', ';', ',', '.', '-', ':', '!', '”'].includes(lastLetter);
  }

  incrementSpeed() {
    if (this.flowState.currentSpeed >= MIN_INTERVAL) {
      this.flowState.currentSpeed -= 50;
    }
  }


  decrementSpeed() {
    if (this.flowState.currentSpeed <= MAX_INTERVAL) {
      this.flowState.currentSpeed += 50;
    }
  }

  start(text: string) {
    if (this.flowState.state === Status.PLAY) {
      return;
    }

    this.flowState.sentence = text;
    const words = this.flowState.sentence.split(/\s+/);
    let playIndex = 0;
    if (this.flowState.state === Status.PAUSE) {
      playIndex = this.flowState.currentIndex;
    }
    this.subscription = from(words).pipe(
      skip(playIndex),
      concatMap(word => of(word)
        .pipe(
          map(x => {
            this.flowState.currentWord = x;
            this.flowState.currentIndex++;
          }),
          delay(this.determineSpeed(word))
        )
      )
    ).subscribe(_ => {
      this.flowState.state = Status.PLAY;
    }, _ => {
    }, () => {
      this.flowState.state = Status.FINISHED;
      this.flowState.currentIndex = 0;
    });
  }

  pause() {
    this.flowState.state = Status.PAUSE;
    this.subscription.unsubscribe();
  }

  restart() {
    this.pause();
    this.flowState.currentIndex = 0;
    this.flowState.currentWord = this.flowState.sentence.slice(0, this.flowState.sentence.indexOf(' '));
    this.flowState.state = Status.NONE;
  }

  presentPopover() {

  }
}

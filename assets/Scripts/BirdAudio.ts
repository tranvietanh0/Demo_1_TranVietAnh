import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("BirdAudio")
export class BirdAudio extends Component {
  @property({
    type: [AudioClip],
    tooltip: "place audio clip here",
  })
  public clips: AudioClip[] = [];

  @property({
    type: AudioSource,
    tooltip: "place audio node here",
  })
  public audioSource: AudioSource = null!;

  //place correct audio clip in the audio player and play the audio
  onAudioQueue(index: number) {

    //place audio clip into the the player
    let clip: AudioClip = this.clips[index];

    //play the audio just once
    this.audioSource.playOneShot(clip);

  }

}

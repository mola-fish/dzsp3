
const ActionPinIcon = 'images/icon_5.png'
const ActionPinColor = 'white'
const ActionPinFont = '25px 黑体'

///
const ActionDistanceColor = '#ffff00'
const ActionDistanceLineColor = 'red';


const AreaBorderMaterial = {
    type: 'glow',
    color: 'yellow'
}

/**
 * @type {ZMapUtils.ActionPlayerOption}
 */
var ActionPlayerConfig = {
    audio: 'lib/test.mp3',
    groups: [
        {
            type: 'rotate',
            start: 0,
            end:20,
            target: [114.16878259071676, 30.667123792065382, 210.427244129925526],
            pitch: 45,
            distance: 4000,
            duration: 20,
            speed:20
        },
    ]
};



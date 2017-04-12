function shadeRGBColor(color, percent) {
	    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
	        return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function neigh(world, neighbors) {
	return [
		neighbors[world.BOTTOM.index],
		neighbors[world.TOP.index],
		neighbors[world.LEFT.index],
		neighbors[world.RIGHT.index]
	];
}
function example_cellWars() {

	var world = new CAWorld({
		width: 96,
		height: 64,
		cellSize: 6
	});

	world.palette = [
		// 0 landPalletStart
		'204,204,0,1',
		'255, 255, ' + 255*1/9 + ',1',
		'255, 255, ' + 255*1/9 + ',1',
		'255, 255, ' + 255*2/9 + ',1',
		'255, 255, ' + 255*3/9 + ',1',
		'255, 255, ' + 255*4/9 + ',1',
		'255, 255, ' + 255*5/9 + ',1',
		'255, 255, ' + 255*6/9 + ',1',
		'255, 255, ' + 255*7/9 + ',1',
		'255, 255, 255, 1',
		'52, 101, 36, 1',
		'255, 255, 255, 1',

		// 12 waterPalletStart
		'0, 0, 255, 1'
	];

	var CHANCE_TO_IGNITE = 0.0001;
	var CHANCE_TO_GROW = 0.01;

	var landPalletStart = 0;
	var waterPalletStart = 12;

	world.registerCellType('land', {
		height: 0,
		waterLevel: 0,
		built: false,
		getColor: function () {
			var level = this.height + landPalletStart;
			if (this.waterLevel > 0) {
				level = waterPalletStart;
			}
			if (world.palette[level] == null) {
				console.log(level, this.waterLevel, this.height);
			}
			return level;
		},
		process: function(neighbors) {
				var nh = neigh(world, neighbors);
				for (i=0; i < nh.length; i++) {

					// Transfer other *into* other cells, if relevant.
					//
					if (nh[i] == null) {
						continue
					}
					if (!nh[i].built) {
						continue
					}
					//console.log(nh[i]);
					if (this.waterLevel == 0) {
						continue
					}
					if (nh[i].height < this.height) {
						if (this.waterLevel >= nh[i].waterLevel) {
							this.waterLevel--;
							nh[i].waterLevel++;
						}
					}
					if (nh[i].heigh == this.height) {
						if (this.waterLevel > nh[i].waterLevel) {
							this.waterLevel--;
							nh[i].waterLevel++;
						}
					}
				}
		},
		reset() {

			if (!this.built) {
				this.height = Math.floor(Math.random() * 10);
				if (Math.random() < 0.2) {
					this.waterLevel = Math.floor(Math.random() * 10);
				}
				this.built = true;
			}

			}

	});
	world.initialize([
		{ name: 'land', distribution: 100 }
	]);

	return world;
};

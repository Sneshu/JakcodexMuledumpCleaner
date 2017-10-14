var pcstatnames = {
	0: 'Shots',
	1: 'Hit Shots',
	2: 'Ability Uses',
	3: 'Tiles Uncovered',
	4: 'Teleports',
	5: 'Potions Drunk',
	6: 'Monster Kills',
	7: 'Monster Assists',
	8: 'God Kills',
	9: 'God Assists',
	10: 'Cube Kills',
	11: 'Oryx Kills',
	12: 'Quests Completed',
	13: 'Pirate Caves',
	14: 'Undead Lairs',
	15: 'Demon Abysses',
	16: 'Snake Pits',
	17: 'Spider Dens',
	18: 'Sprite Worlds',
	19: 'Level Up Assists',
	20: 'Minutes Active',
	21: 'Ancient Tombs',
	22: 'Ocean Trenches',
	23: 'Forbidden Jungles',
	24: 'Immortal Manors',
	25: 'Forest Mazes',
	26: 'Lairs of Draconis',
	28: 'Haunted Cems',
	29: 'Treasure Caves',
	30: 'Mad Labs',
	31: 'Wine Cellars',
	34: 'Ice Caves',
	35: 'Deadwater Docks',
	36: 'Crawling Depths',
	37: 'Labyrinths',
	38: 'Nexus Battles',
	39: 'Shatters',
	40: 'Belladonnas',
	41: 'Puppet Theatres',
	42: 'Toxic Sewers',
	43: 'The Hives',
	44: 'Mountain Temples',
	45: 'The Nests',
	46: 'Hardmode Lairs',
	47: 'Lost Halls',
	48: 'Cultist Hideouts',
	49: 'The Voids'
}

var shortdungeonnames = { // sorted by "tier"
	13: 'Pirate',
	23: 'Jungle',
	17: 'Spider',
	16: 'Snake',
	18: 'Sprite',
	24: 'Manor',
	14: 'UDL',
	15: 'Abyss',
	22: 'Trench',
	21: 'Tomb',
}

var bonuses = {
	'Ancestor': function(s, c) {
		return (c.id < 2) ? {mul: 0.1, add: 20} : 0;
	},
	'Legacy Builder': function(s, c, d) {
		// 0.1
	},
	'Pacifist': function(s) {
		return s[1] ? 0 : 0.25;
	},
	'Thirsty': function(s) {
		return s[5] ? 0 : 0.25;
	},
	'Mundane': function(s) {
		return s[2] ? 0 : 0.25;
	},
	'Boots on the Ground': function(s) {
		return s[4] ? 0 : 0.25;
	},
	'Tunnel Rat': function(s) {
		for (var i in shortdungeonnames) if (!s[i]) return 0;
		return 0.1;
	},
	'Gods Enemy': function(s) {
		return (s[8] / (s[6] + s[8]) > 0.1) ? 0.1 : 0;
	},
	'Gods Slayer': function(s) {
		return (s[8] / (s[6] + s[8]) > 0.5) ? 0.1 : 0;
	},
	'Oryx Slayer': function(s) {
		return s[11] ? 0.1 : 0;
	},
	'Accurate': function(s) {
		return (s[1] / s[0] > 0.25) ? 0.1 : 0;
	},
	'Sharpshooter': function(s) {
		return (s[1] / s[0] > 0.5) ? 0.1 : 0;
	},
	'Sniper': function(s) {
		return (s[1] / s[0] > 0.75) ? 0.1 : 0;
	},
	'Explorer': function(s) {
		return (s[3] > 1e6) ? 0.05 : 0;
	},
	'Cartographer': function(s) {
		return (s[3] > 4e6) ? 0.05 : 0;
	},
	'Team Player': function(s) {
		return (s[19] > 100) ? 0.1 : 0;
	},
	'Leader of Men': function(s) {
		return (s[19] > 1000) ? 0.1 : 0;
	},
	'Doer of Deeds': function(s) {
		return (s[12] > 1000) ? 0.1 : 0;
	},
	'Cubes Friend': function(s) {
		return s[10] ? 0 : 0.1;
	},
	'Well Equipped': function(s, c) {
		var eq = c.Equipment.split(',');
		var b = 0;
		for (var i = 0; i < 4; i++) {
			var it = items[+eq[i]] || items[-1];
			b += it[5];
		}
		return b * 0.01;
	},
	'First Born': function(s, c, d, f) {
		return (d.Account.Stats.BestCharFame < f) ? 0.1: 0;
	},
}

var goals = {
	'Tunnel Rat': function(s) {
		var r = [];
		for (var i in shortdungeonnames) {
			if (!s[i]) r.push(shortdungeonnames[i]);
		}
		return [r.join(', '), 'dungeons'];
	},
	'Enemy of the Gods': function(s) {
		var x = s[6] / 9 - s[8];
		if (Math.ceil(x) == x) x += 1;
		return [Math.ceil(x), 'god kills'];
	},
	'Slayer of the Gods': function(s) {
		return [s[6] - s[8] + 1, 'god kills'];
	},
	'Oryx Slayer': function(s) {
		return s[11] ? 0 : [1, 'Oryx kill'];
	},
	'Accurate': function(s) {
		var x = (0.25 * s[0] - s[1]) / 0.75;
		if (Math.ceil(x) == x) x += 1;
		return [Math.ceil(x), 'shots'];
	},
	'Sharpshooter': function(s) {
		var x = (0.5 * s[0] - s[1]) / 0.5;
		if (Math.ceil(x) == x) x += 1;
		return [Math.ceil(x), 'shots'];
	},
	'Sniper': function(s) {
		var x = (0.75 * s[0] - s[1]) / 0.25;
		if (Math.ceil(x) == x) x += 1;
		return [Math.ceil(x), 'shots'];
	},
	'Explorer': function(s) {
		return [1e6 - s[3] + 1, 'tiles'];
	},
	'Cartographer': function(s) {
		return [4e6 - s[3] + 1, 'tiles'];
	},
	'Team Player': function(s) {
		return [100 - s[19] + 1, 'party levelups'];
	},
	'Leader of Men': function(s) {
		return [1000 - s[19] + 1, 'party levelups'];
	},
	'Doer of Deeds': function(s) {
		return [1000 - s[12] + 1, 'quests'];
	},
}


function readstats(pcstats) {
	function readInt32BE(str, idx) {
		var r = 0;
		for (var i = 0; i < 4; i++) {
			var t = str.charCodeAt(idx + 3 - i);
			r += t << (8 * i);
		}
		return r;
	}

	pcstats = pcstats || ''
	var b = atob(pcstats.replace(/-/g, '+').replace(/_/g, '/'));
	var r = [];
	for (var i = 0; i < b.length; i += 5) {
		var f = b.charCodeAt(i);
		var val = readInt32BE(b, i + 1);
		r[f] = val;
	}
	for (var i in pcstatnames) if (!r[i]) r[i] = 0;
	return r;
}

function printstats(c, d, dogoals, dostats) {
	var st = readstats(c.PCStats);
	var $c = $('<table class="pcstats" />');
	var fame = +c.CurrentFame;
	var basefame = +c.CurrentFame;
	var totalDungs = 0;
	
	function commas(x) {
		x = x.toString();
		var pattern = /(-?\d+)(\d{3})/;
		while (pattern.test(x)) x = x.replace(pattern, "$1.$2");
		return x;
	}
	
	function br(cl, text, x, y)
	{
		$('<tr style = "position:relative;">')
			.append($('<td colspan = "2"; background: #545454;">').addClass(cl).text(text))
			.appendTo($c);			
	}
	
	function goal(name, val, cl)
	{
		if (goalfame != 0)
		{
			perc = (val / goalfame) * 100;
			val = commas(val);
		
			if (basefame >= goalfame)
			{
				$('<tr>')
				.append($('<td>').text(name))
				.append($('<td>').addClass(cl || 'pcstat').text(val))
				.appendTo($c);
				
				$('<tr>')
				.append($('<td>').text('Goal Progress'))
				.append($('<td>').addClass('completed' || 'pcstat').text('Completed!'))
				.appendTo($c);
			}
			else
			{
				$('<tr>')
				.append($('<td>').text(name))
				.append($('<td>').addClass(cl || 'pcstat').text(commas(val) + " / " + commas(goalfame)))
				.appendTo($c);
				
				$('<tr>')
				.append($('<td>').text('Goal Progress'))
				.append($('<td>').addClass(cl || 'pcstat').text(perc.toFixed(2)  + " %"))
				.appendTo($c);
			}
		}
	}
	
	function tline(name, val, cl, dung) {
		
		if (cl == 'multiplier')
		{
			var multiplier = (val / basefame).toFixed(2);
			
			$('<tr>')
			.append($('<td>').text(name))
			.append($('<td>').addClass('multiplier').text("x" + multiplier))
			.appendTo($c);
		}
		
		else if (cl == 'totalfame')
		{
			val = commas(val);
			$('<tr>')
			.append($('<td>').addClass('totalfametext').text(name))
			.append($('<td>').addClass(cl || 'pcstat').text(val))
			.appendTo($c);
		}
		
		else if (cl == 'totaldungs')
		{
			val = commas(val);
			$('<tr>')
			.append($('<td>').addClass('totaldungsleft').text(name))
			.append($('<td>').addClass(cl || 'pcstat').text(val))
			.appendTo($c);
		}
		
		else
		{
			if (dung == 1 && dungeonsTieredCounter == 1)
			{
				totalDungs += val;
				
				if (val < 5)
				{
					val = commas(val);
					$('<tr>')
					.append($('<td>').text(name))
					.append($('<td>').addClass(cl || 'tier1').text(val))
					.appendTo($c);
				}
					
				else if (val < 10)
				{
					val = commas(val);
					$('<tr>')
					.append($('<td>').text(name))
					.append($('<td>').addClass(cl || 'tier2').text(val))
					.appendTo($c);
				}
					
				else if (val < 25)
				{
					val = commas(val);
					$('<tr>')
					.append($('<td>').text(name))
					.append($('<td>').addClass(cl || 'tier3').text(val))
					.appendTo($c);
				}	
					
				else if (val < 50)
				{
					val = commas(val);
					$('<tr>')
					.append($('<td>').text(name))
					.append($('<td>').addClass(cl || 'tier4').text(val))
					.appendTo($c);
				}
					
				else
				{
					val = commas(val);
					$('<tr>')
					.append($('<td>').text(name))
					.append($('<td>').addClass(cl || 'tier5').text(val))
					.appendTo($c);
				}
			}
			
			else
			{
				val = commas(val);
				$('<tr>')
				.append($('<td>').text(name))
				.append($('<td>').addClass(cl || 'pcstat').text(val))
				.appendTo($c);
			}
			
		}
	}
	function gline(t, b) {
		$('<tr>')
			.append($('<td colspan=2>')
				.addClass('goal')
				.append($('<span>').text(t))
				.append($('<span class="bonus">').text(b))).appendTo($c);
	}
	
	var a = 0;
	
	for (var i in st + 1) {
		a = i;
		
		// Kolejnosc wyswietlania - posegregowanie rzeczy
		if (i == 0) a = -1, br('stinfo', 'Basic info');
		else if (i == 1) a = 20;
		else if (i == 2) a = 3;
		else if (i == 3) a = 12;
		else if (i == 4) a = 19;
		else if (i == 5) a = 5;
		else if (i == 6) a = 4;
		else if (i == 7) a = -1, br('stinfo', 'Combat info');
		else if (i == 8) a = 0;
		else if (i == 9) a = 1;
		else if (i == 10) a = 2;
		else if (i == 11) a = 6;
		else if (i == 12) a = 7;
		else if (i == 13) a = 8;
		else if (i == 14) a = 9;
		else if (i == 15) a = 10;
		else if (i == 16) a = 11;
		else if (i == 17) a = -1, br('stinfo', 'Dungeons');
		else if (i >= 18 && i <= 23) a = i - 5;
		else if (i >= 24) a = i - 3;
		else a = i;
	
		if (a == -1);
		else
		{
			if (!st[a]) continue;
			var sname = pcstatnames[a] || '#' + a;
			if (a >= 13 && a != 19 && a != 20) tline(sname, st[a], "", 1);
			else tline(sname, st[a]);
		}
	}
	
	tline('Dungeons Done', totalDungs, 'totaldungs');
	
	br('stinfo', 'Stats');
	
	if (st[0] > 59) {
		var v = st[20], r = []
		var divs = { 'd': 24 * 60, 'h': 60, 'm': 1 }
		for (var s in divs) {
			if (r.length > 2) break;
			var t = Math.floor(v / divs[s]);
			if (t) r.push(t + s);
			v %= divs[s];
		}
		tline('Active', r.join(' '), 'info');
	}
	if (st[0] && st[1]) {
		tline('Accuracy', Math.round(10000 * st[1] / st[0]) / 100 + ' %', 'info');
	}
	if (st[8]) {
		tline('God Kill Ratio', Math.round(10000 * st[8] / (st[6] + st[8])) / 100 + ' %', 'info');
	}

	goal('Base Fame', basefame, 'basefame');
	
	br('stinfo', 'Goals');
	
	if (dogoals) {
		var p = '';
		for (var a in goals) {
			var x = goals[a](st);
			if (!x || x[0] <= 0) continue;
			var s = x[0] + ' for ';
			if (p != x[1]) {
				p = x[1]
				s = '\u2022 ' + x[1] + ': ' + s
			}
			gline(s, a);
		}
	}
	if (!dostats) return $c;
	
	br('stinfo', 'Bonuses');
	
	if (!fame) return $c;
	for (var k in bonuses) {
		var b = bonuses[k](st, c, d, fame);
		if (!b) continue;
		var incr = 0;
		if (typeof b == 'object') {
			incr += b.add;
			b = b.mul;
		}
		incr += Math.floor(fame * b);
		fame += incr;
		tline(k, '+' + incr, 'bonus');
	}
	tline('Multiplier', fame, 'multiplier');
	tline('Total Fame', fame, 'totalfame');
	
	return $c;
}

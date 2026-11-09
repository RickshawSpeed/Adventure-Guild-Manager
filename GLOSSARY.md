# Adventure Guild Manager

A multiplayer guild-management game: Players run a Guild, recruit Adventurers, and send Parties on Expeditions into a dungeon shared by every Guild.

## Players and Guilds

**Player**:
The human playing the game.
_Avoid_: User, gamer

**Account**:
A Player's login identity, distinct from the Guild it owns.
_Avoid_: Profile, user

**Guild**:
The organisation a Player runs: its Adventurers, Headquarters and resources.
_Avoid_: Clan, team

**Debt**:
Unpaid Wages and Upkeep a Guild has built up after running out of Gold. It lowers Facilities to basic service and Morale, but never causes Items or Facilities to be taken away.
_Avoid_: Bankruptcy, deficit, arrears

**Guild Rank**:
A Guild's lifetime standing earned from Dungeon achievements (loot value brought home, depth reached, Core completions). It only rises, and unlocks higher Facility Levels, larger Parties, more Market listings, better Applicants and cosmetic titles. It never limits which Zones a Guild may enter.
_Avoid_: Guild level, tier, prestige

**Reputation**:
How a Guild is regarded, lowered by attacking other Guilds' Parties; it affects Applicants and how other Adventurers react to the Guild's Parties.
_Avoid_: Fame, standing, karma

**Guild Relations**:
The record of how one Guild's Parties have treated another's (attacks, trades, cooperation), which shapes Stance and Adventurers' reactions in Encounters.
_Avoid_: Grudges, diplomacy, standing

**Roster**:
The Adventurers currently belonging to a Guild; its maximum size is set by Housing.
_Avoid_: Members, team, staff list

## Adventurers

**Adventurer**:
Any person in the game who can belong to a Guild, whether they go on Expeditions or work in Facilities. There is no separate worker type.
_Avoid_: Adventure, hero, unit, character, worker

**Party**:
A group of Adventurers dispatched together; its maximum size grows with Guild Rank.
_Avoid_: Team, squad, group

**Party Leader**:
The Adventurer whose judgement decides what the Party does, influenced by the other members and by Requests. Appointed by the Player, but the Party may replace them mid-Expedition.
_Avoid_: Captain, commander

**Expedition**:
One Party's single run into the dungeon, from departure to return.
_Avoid_: Run, raid, mission, quest

**Trait**:
A fixed personality characteristic of an Adventurer that shapes their decisions (e.g. Greedy, Cautious, Loyal).
_Avoid_: Perk, quirk, personality stat

**Skill**:
A learnable ability of an Adventurer that grows through Training, Education and Dungeon experience.
_Avoid_: Stat, attribute, ability

**Need**:
A fluctuating requirement of an Adventurer (Rest, Hunger, Health, Stress) that Facilities exist to satisfy.
_Avoid_: Meter, status, bar

**Morale**:
An Adventurer's overall disposition, derived from their Traits, Skills, Needs and recent events; it drives how readily they heed Requests and whether they stay.
_Avoid_: Happiness, mood, loyalty

**Role**:
A descriptive label for an Adventurer derived from their strongest Skills (e.g. "Healer"); it carries no rules of its own.
_Avoid_: Class, job, archetype

**Downed**:
The state of an Adventurer defeated in the Dungeon: alive but helpless, and dying unless carried out in time.
_Avoid_: Unconscious, KO'd, fainted

**Affinity**:
The relationship between two Adventurers of the same Guild, shaped by shared Expeditions and Recreation.
_Avoid_: Friendship, bond, relationship score

**Petition**:
Something an Adventurer asks of the Player (a raise, a Buyout, Retirement, time off, a Party preference), which the Player grants, refuses or negotiates, with Morale reacting.
_Avoid_: Demand, complaint, ticket

**Injury**:
A lasting harm from being Downed (e.g. a lost eye) that permanently weakens certain Skills or behaviour; better Medical makes it less likely.
_Avoid_: Wound, scar, debuff

**Wage**:
The regular payment a Guild owes each of its Adventurers, paid into their Purse.
_Avoid_: Salary, upkeep

**Loot Share**:
The portion of an Expedition's loot value, set by Guild policy, paid into the Purses of the Adventurers who went on it.
_Avoid_: Cut, bonus, commission

**Retirement**:
The end of an Adventurer's active career, requested by the Adventurer through a Petition as they age; the Player may persuade them to delay it at a Morale cost.
_Avoid_: Leaving, quitting

**Staff**:
Any Adventurer, active or retired, assigned to work in a Facility, improving what it provides. An Adventurer on an Expedition cannot work as Staff at the same time.
_Avoid_: Worker, NPC, employee

**Purse**:
An Adventurer's personal Gold, which they spend by their own choice.
_Avoid_: Wallet, savings, personal funds

**Carried Gold**:
The part of an Adventurer's Purse they choose to take on an Expedition, usable for bribes and trades and lost to their Remains if they die.
_Avoid_: Pocket money, expedition fund

**Gold**:
The single currency of the game.
_Avoid_: Money, coins, credits

**Item**:
Any physical thing found, carried or crafted: equipment, consumables and Dungeon materials. Every Item is owned either by a Guild or by an Adventurer.
_Avoid_: Loot (as a noun for one thing), resource, material

**Issued Item**:
An Item owned by a Guild and carried by one of its Adventurers. It stays with the Guild if the Adventurer leaves, unless the Adventurer buys it.
_Avoid_: Loaned gear, Guild gear

**Personal Item**:
An Item owned by an Adventurer, which leaves with them.
_Avoid_: Own gear, private item

**Buyout**:
A Petition to purchase an Issued Item from the Guild at a price the Adventurer proposes.
_Avoid_: Purchase, claim

**Pocketing**:
An Adventurer keeping an Item found on an Expedition as a Personal Item instead of handing it to the Guild.
_Avoid_: Stealing, skimming, theft

**Market**:
The shared marketplace where Guilds and Adventurers buy and sell Items for Gold.
_Avoid_: Auction house, shop, exchange

## Recruitment

**Recruit Pool**:
The shared set of unaffiliated Adventurers available to all Guilds.
_Avoid_: Tavern, market, hiring board

**Application**:
An Adventurer's request to join a particular Guild, which the Guild may accept or reject. Applicants may apply to several Guilds at once; the first acceptance wins.
_Avoid_: Request (reserved for Player guidance to a Party)

**Offer**:
A Guild's proposal to an Adventurer in the Recruit Pool to join it. Never made to another Guild's Adventurer.
_Avoid_: Invite, bid

**Trade**:
A transfer of an Adventurer from one Guild to another, agreed between the two Guilds. The Adventurer cannot refuse, but their Morale reacts.
_Avoid_: Transfer, sale, swap

**Quitting**:
An Adventurer leaving their Guild of their own accord after prolonged low Morale, returning to the Recruit Pool.
_Avoid_: Desertion, retirement

## Headquarters

**Headquarters**:
A Guild's home base, composed of Facilities.
_Avoid_: HQ (in prose), base, town

**Facility**:
One functional part of the Headquarters: Housing, Crafting, Training, Recreation, Medical, Nutrition, Education or Storehouse.
_Avoid_: Building, room, station

**Facility Level**:
How developed a Facility is; raising it costs Gold and Items, takes time, and increases its Capacity and Quality.
_Avoid_: Tier, rank, upgrade level

**Capacity**:
How many Adventurers a Facility can serve at once (or, for the Storehouse, how many Items it holds). Adventurers wait when it is full.
_Avoid_: Slots, size

**Quality**:
How well a Facility meets Needs or develops Skills.
_Avoid_: Efficiency, effectiveness, grade

**Amenity**:
A paid extra a Facility offers beyond its free basic service, priced by the Player and bought by Adventurers from their Purse.
_Avoid_: Upgrade, premium, luxury

**Upkeep**:
The recurring cost, in Gold and in Items consumed, of running a Facility.
_Avoid_: Maintenance, running cost

**Restocking**:
A Guild automatically buying missing Upkeep Items from the Market, up to a price limit the Player sets. If it cannot, the Facility falls back to a basic service that runs on Gold alone.
_Avoid_: Auto-buy, supply order

**Recipe**:
Knowledge of how to craft a particular Item, owned by the Guild. Learned from Dungeon finds, Denizens or Education; a small starter set is known by every Guild.
_Avoid_: Blueprint, schematic, formula

**Skill Ceiling**:
The highest level a Facility can raise a Skill to, set by the Facility's Quality and the best teaching Staff's Skill. Progress beyond it comes only from Dungeon experience.
_Avoid_: Cap, max level, training limit

**Dungeon Lore**:
Knowledge taught through Education about Monsters and Denizens, which improves how Adventurers handle them.
_Avoid_: Bestiary, intel, knowledge

**Storehouse**:
The Facility that holds a Guild's Items, with a Capacity limit. Personal Items are kept in Housing instead.
_Avoid_: Vault, warehouse, inventory, bank

## The Dungeon

**Dungeon**:
A procedurally generated underground space, shared by all Guilds, that exists from when it opens until a Party completes its Core, intended to take about a month. Its contents are finite: what is taken or killed does not return.
_Avoid_: Map, level, world

**Room**:
A named area of tiles within a Zone (e.g. "the Flooded Crypt"), used to refer to places in Expedition Logs, maps, Requests and loot placement.
_Avoid_: Chamber, area, location

**Tile**:
One square of a Zone's grid, about five feet across; the unit of position and movement.
_Avoid_: Cell, square, hex

**Core**:
The challenge in the deepest Zone of a Dungeon whose completion seals that Dungeon. It cannot be attempted until its Keys are gathered; every Guild with a Party actively taking part when it is completed shares the credit.
_Avoid_: Boss, heart, final event, goal

**Key**:
An Item or objective scattered through a Dungeon that is required to unlock its Core. Keys are tradable.
_Avoid_: Sigil, shard, fragment

**Theme**:
The character of a Zone (e.g. flooded caves, fungal forest), which decides the Monsters, Traps, materials and hazards found there.
_Avoid_: Biome, tileset, environment

**Camp**:
A rest a Party takes inside a Dungeon, eating carried rations to restore Needs, during which it can be ambushed.
_Avoid_: Rest stop, bivouac

**Denizen Opinion**:
A Denizen's lasting attitude toward a particular Guild for the life of the Dungeon, shaped by how that Guild's Parties treated it.
_Avoid_: Faction standing, reputation (reserved for Guilds)

**Sealed Dungeon**:
A Dungeon whose Core has been completed: no new Expeditions may enter, but Parties already inside continue until they leave.
_Avoid_: Closed, collapsed, finished

**Monster**:
A hostile creature generated with a Dungeon. Once killed it does not return.
_Avoid_: NPC, mob, enemy, creep

**Denizen**:
A non-hostile character generated with a Dungeon (e.g. a merchant, hermit or prisoner) whom Parties can trade with, bribe, learn from or rescue.
_Avoid_: NPC, villager, townsfolk

**Remains**:
The Items left where an Adventurer died in a Dungeon, which any Party may loot.
_Avoid_: Corpse, grave, drop

**Zone**:
A bounded region of a Dungeon whose activity is simulated independently of other Zones. Parties only meet others in the same Zone.
_Avoid_: Instance, floor, area, level

**Passage**:
A fixed connection between two Zones through which a Party may move mid-Expedition.
_Avoid_: Portal, door, stairs

**Portal**:
An exit and entrance deep inside a Dungeon that a Guild can find and unlock. Once unlocked it serves only that Guild, whose Parties may start Expeditions there and Return through it.
_Avoid_: Waypoint, shortcut, teleporter

## Encounters

**Encounter**:
Any meeting between a Party and something else in a Dungeon: Monsters, Denizens, or another Guild's Party.
_Avoid_: Event, meeting, fight

**Guild Encounter**:
An Encounter between Parties of different Guilds, resolved by the Adventurers' own decisions.
_Avoid_: Clash, PvP event

**Request**:
Guidance a Player gives a Party on an Expedition (Destination, Return, Priority or Stance) or an Adventurer at home (e.g. which Skill to train). The recipient weighs it against their own judgement and may ignore it.
_Avoid_: Orders, commands, stance, policy

**Expedition Log**:
The record of everything that happened to a Party during an Expedition, shown to the Player on return or while watching.
_Avoid_: Report, history, battle log

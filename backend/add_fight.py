"""
Run manually from backend/: python add_fight.py
Interactively records a completed fight into the fights table, pulling
both fighters' current stats from the fighters table. Run train_model.py
afterward to retrain on the new data.
"""

import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
engine = create_engine(os.getenv('DATABASE_URL'))

# (fighters table column, fights table column suffix) -- case differs for
# some columns since the fights table was created with mixed-case names.
STAT_COLUMNS = [
    ('wins', 'wins'),
    ('losses', 'losses'),
    ('last5', 'last5'),
    ('slpm', 'SLpM'),
    ('stracc', 'StrAcc'),
    ('sapm', 'SApM'),
    ('strdef', 'StrDef'),
    ('tdavg', 'TDAvg'),
    ('tdacc', 'TDAcc'),
    ('tddef', 'TDDef'),
    ('subavg', 'SubAvg'),
    ('kdavg', 'KDAvg'),
    ('ranking', 'ranking'),
    ('birth_year', 'birth_year'),
    ('height', 'height'),
    ('reach', 'reach'),
    ('prev_weight_class', 'prev_weight_class'),
    ('five_rd_dec_wins', 'five_rd_dec_wins'),
]


def fetch_fighter(conn, name):
    row = conn.execute(
        text("SELECT * FROM fighters WHERE name = :name"),
        {'name': name.strip().lower()}
    ).mappings().first()
    if row is None:
        raise SystemExit(f"No fighter named '{name}' found in fighters table.")
    return row


def ask(prompt, default=None):
    suffix = f" [{default}]" if default is not None else ""
    answer = input(f"{prompt}{suffix}: ").strip()
    return answer if answer else default


def quoted(fights_col):
    return f'"{fights_col}"' if fights_col != fights_col.lower() else fights_col


def main():
    with engine.connect() as conn:
        f1 = fetch_fighter(conn, ask("Fighter 1"))
        f2 = fetch_fighter(conn, ask("Fighter 2"))

        winner = ask(f"Who won, 1 ({f1['name']}) or 2 ({f2['name']})?")
        outcome = 1 if winner == '1' else 0

        round_finished = int(ask("What round did it end / decision reached in?"))
        fight_rounds = int(ask("Scheduled rounds", default=5 if round_finished > 3 else 3))
        weight_class = ask("Weight class", default=f1['weight_class'])
        fight_year = int(ask("Fight year", default=datetime.now().year))

        params = {
            'fighter1': f1['name'], 'fighter2': f2['name'],
            'fight_year': fight_year,
            'weight_class': weight_class,
            'round_finished': round_finished,
            'fight_rounds': fight_rounds,
            'outcome': outcome,
        }
        columns = list(params.keys())

        for fighters_col, fights_suffix in STAT_COLUMNS:
            for n, fighter in (('1', f1), ('2', f2)):
                fights_col = f'fighter{n}_{fights_suffix}'
                columns.append(fights_col)
                params[fights_col] = fighter[fighters_col]

        column_sql = ', '.join(quoted(c) for c in columns)
        placeholder_sql = ', '.join(f':{c}' for c in columns)

        conn.execute(text(f"INSERT INTO fights ({column_sql}) VALUES ({placeholder_sql})"), params)
        conn.commit()

    winner_name = f1['name'] if outcome == 1 else f2['name']
    print(f"Added: {f1['name']} vs {f2['name']} -> {winner_name} wins, round {round_finished}/{fight_rounds}")
    print("Run train_model.py to retrain on this new fight.")


if __name__ == '__main__':
    main()

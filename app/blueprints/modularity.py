from flask import Blueprint, render_template

modularity_bp = Blueprint('modularity', __name__, url_prefix='/modularity')


@modularity_bp.route('/code')
def codeComponents():
    desc = "code test"

    return render_template('modularity_level.html', viewpoint="Code", description=desc)


@modularity_bp.route('/non-code')
def nonCodeComponents():
    desc = "non-code test"

    return render_template('modularity_level.html', viewpoint="Non-code", description=desc)

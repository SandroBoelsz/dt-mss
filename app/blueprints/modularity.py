from flask import Blueprint, render_template

modularity_bp = Blueprint('modularity', __name__, url_prefix='/modularity')


@modularity_bp.route('/code')
def codeComponents():
    desc = """
    For code components, the goal is to classify how each component should be deployed and encapsulated,
     based on its internal structure, dependencies, and interaction patterns.
    """

    return render_template('modularity_level.html', viewpoint="Code", description=desc)


@modularity_bp.route('/non-code')
def nonCodeComponents():
    desc = """
    For non-code components, the goal is to classify how each component should be deployed, accessed,
     or encapsulated based on its execution properties, data characteristics, and supporting role within the
     system.
    """

    return render_template('modularity_level.html', viewpoint="Non-code", description=desc)
